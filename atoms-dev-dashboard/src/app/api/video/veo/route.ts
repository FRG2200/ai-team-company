import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 8, resolution = '720p', aspectRatio = '16:9' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY in Vercel environment variables.' }, { status: 500 });
    }

    // Google Gemini Veo API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            aspectRatio,
            durationSeconds: String(duration),
            resolution,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('Veo API error:', errorData);
      return NextResponse.json({ error: `Veo API error: ${JSON.stringify(errorData)}` }, { status: response.status });
    }

    const data = await response.json();
    // data.name is the operation name like "operations/xxx"
    const operationName = data.name;

    return NextResponse.json({
      taskId: operationName,
      status: 'queued',
      engine: 'veo',
    });
  } catch (error: unknown) {
    console.error('Veo route error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
