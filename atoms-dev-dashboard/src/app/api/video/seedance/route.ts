import { NextRequest, NextResponse } from 'next/server';

const SEEDANCE_API_KEY = process.env.BYTEPLUS_API_KEY || '84f90901-c0fa-4143-815d-55da9561dba6';
const SEEDANCE_ENDPOINT = 'https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks';

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 10, resolution = '720p', audio = true } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const body = {
      model: 'seedance-1-5-pro-251215',
      content: [
        {
          type: 'text',
          text: prompt.slice(0, 500),
        }
      ],
      parameters: {
        resolution,
        duration,
        fps: 24,
        generate_audio: audio,
      }
    };

    const response = await fetch(SEEDANCE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SEEDANCE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Seedance API error:', errorText);
      return NextResponse.json({ error: `Seedance API error: ${response.status} - ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      taskId: data.id,
      status: data.status,
      engine: 'seedance',
    });
  } catch (error) {
    console.error('Seedance route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
