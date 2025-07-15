import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getChatCompletion } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { message, chatId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      )
    }

    // Check user's token limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.tokensUsed >= user.tokensLimit) {
      return NextResponse.json(
        { message: 'Token limit exceeded. Please upgrade your plan.' },
        { status: 429 }
      )
    }

    let chat
    let messages: any[] = []

    if (chatId) {
      // Get existing chat with messages
      chat = await prisma.chat.findUnique({
        where: { id: chatId, userId: session.user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      })

      if (!chat) {
        return NextResponse.json(
          { message: 'Chat not found' },
          { status: 404 }
        )
      }

      const maxHistory = 6
      messages = chat.messages
      .slice(-maxHistory) // Limit to last 6 messages
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    } else {
      // Create new chat
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        }
      })
    }

    // Add user message to conversation
    messages.push({ role: 'user', content: message })

    // Save user message to database
    await prisma.message.create({
      data: {
        chatId: chat.id,
        role: 'user',
        content: message,
        tokens: Math.ceil(message.length / 4), // Rough token estimation
      }
    })

    // Get AI response
    const aiResponse = await getChatCompletion(messages)

    // Save assistant message to database
    const assistantMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: aiResponse.content,
        tokens: aiResponse.tokens,
      }
    })

    // Update chat token usage
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        tokensUsed: {
          increment: aiResponse.tokens + Math.ceil(message.length / 4)
        }
      }
    })

    // Update user token usage
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        tokensUsed: {
          increment: aiResponse.tokens + Math.ceil(message.length / 4)
        }
      }
    })

    return NextResponse.json({
      content: aiResponse.content,
      messageId: assistantMessage.id,
      chatId: chat.id,
      tokensUsed: aiResponse.tokens,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}