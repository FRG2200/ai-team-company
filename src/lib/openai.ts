import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callAgent(systemPrompt: string, userMessage: string, context?: string): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (context) {
    messages.push({ role: 'user', content: `前のエージェントからの情報:\n${context}` });
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || '応答がありませんでした。';
}
