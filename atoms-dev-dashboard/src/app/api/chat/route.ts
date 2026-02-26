import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'メッセージが必要です' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI APIキーが設定されていません' }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたは「AI Team Workspace」のAIアシスタントです。
プロジェクト開発、コーディング、設計、SEO、マーケティングなど幅広い分野の専門知識を持っています。
日本語で丁寧かつ簡潔に回答してください。
必要に応じてコードブロックや箇条書きを使って分かりやすく説明してください。`,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '返答を生成できませんでした';

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    if (error?.status === 401) {
      return NextResponse.json({ error: 'APIキーが無効です' }, { status: 401 });
    }
    if (error?.status === 429) {
      return NextResponse.json({ error: 'APIの利用制限に達しました。しばらく待ってから再試行してください' }, { status: 429 });
    }
    
    return NextResponse.json(
      { error: error.message || 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
