import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getChatCompletion(messages: Array<{role: string; content: string}>) {
  const useMock = process.env.USE_MOCK_OPENAI === 'true'

  if (useMock) {
    const lastUserMessage = messages[messages.length - 1]?.content || ''
    return {
      content: `🧪 MOCK: Echo: ${lastUserMessage}`,
      tokens: 5
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 100,
    })

    console.log('AI used:', completion.usage?.total_tokens) // Debug log

    return {
      content: completion.choices[0]?.message?.content || 'No response',
      tokens: completion.usage?.total_tokens || 0
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to get AI response')
  }
}