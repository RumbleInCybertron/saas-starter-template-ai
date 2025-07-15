import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import ChatClient from '../_components/ChatClient'

export default async function ChatIdPage({ params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/signin')
  }

  const chat = await prisma.chat.findUnique({
    where: { id: params.chatId, userId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!chat) {
    notFound()
  }

  return (
    <ChatClient
      chatId={chat.id}
      initialMessages={chat.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      }))}
    />
  )
}
