import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 8, quality = 'standard', size = '1280x720' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const model = quality === 'pro' ? 'sora-2-pro' : 'sora-2';

    // Use fetch directly to call OpenAI Videos API
    const response = await fetch('https://api.openai.com/v1/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        seconds: duration,
        size,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('Sora API error:', errorData);
      return NextResponse.json({ error: `Sora API error: ${errorData.error?.message || response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      taskId: data.id,
      status: data.status,
      engine: 'sora',
      model,
    });
  } catch (error: unknown) {
    console.error('Sora route error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
