import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI APIキーが設定されていません' }, { status: 500 });
    }

    const system = systemPrompt || `あなたはAIチームのアシスタントです。日本語で簡潔に回答してください。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '返答を生成できませんでした';
    return NextResponse.json({ content });

  } catch (error: any) {
    console.error('Chat API error:', error);
    if (error?.status === 401) return NextResponse.json({ error: 'APIキーが無効です' }, { status: 401 });
    if (error?.status === 429) return NextResponse.json({ error: 'API利用制限に達しました' }, { status: 429 });
    return NextResponse.json({ error: error.message || 'サーバーエラー' }, { status: 500 });
  }
}
