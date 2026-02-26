import { NextRequest, NextResponse } from 'next/server';

const SEEDANCE_API_KEY = process.env.BYTEPLUS_API_KEY || '84f90901-c0fa-4143-815d-55da9561dba6';
const SEEDANCE_ENDPOINT = 'https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('taskId');
  const engine = searchParams.get('engine');

  if (!taskId || !engine) {
    return NextResponse.json({ error: 'taskId and engine are required' }, { status: 400 });
  }

  try {
    // --- Seedance ---
    if (engine === 'seedance') {
      const response = await fetch(`${SEEDANCE_ENDPOINT}/${taskId}`, {
        headers: { 'Authorization': `Bearer ${SEEDANCE_API_KEY}` },
      });

      if (!response.ok) {
        return NextResponse.json({ error: `Seedance status error: ${response.status}` }, { status: response.status });
      }

      const data = await response.json();
      const statusMap: Record<string, string> = {
        queued: 'queued',
        running: 'in_progress',
        succeeded: 'completed',
        failed: 'failed',
      };

      let videoUrl: string | null = null;
      if (data.status === 'succeeded' && data.content) {
        const videoContent = data.content.find((c: { type: string; url?: string }) => c.type === 'video');
        videoUrl = videoContent?.url || null;
      }

      return NextResponse.json({
        taskId,
        engine: 'seedance',
        status: statusMap[data.status] || data.status,
        progress: data.status === 'succeeded' ? 100 : data.status === 'running' ? 50 : 10,
        videoUrl,
      });
    }

    // --- Sora ---
    if (engine === 'sora') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
      }

      const response = await fetch(`https://api.openai.com/v1/videos/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return NextResponse.json({ error: `Sora status error: ${err.error?.message || response.status}` }, { status: response.status });
      }

      const data = await response.json();
      let videoUrl: string | null = null;
      if (data.status === 'completed') {
        videoUrl = `https://api.openai.com/v1/videos/${taskId}/content`;
      }

      return NextResponse.json({
        taskId,
        engine: 'sora',
        status: data.status,
        progress: data.status === 'completed' ? 100 : data.status === 'in_progress' ? 50 : 10,
        videoUrl,
      });
    }

    // --- Veo (Google) ---
    if (engine === 'veo') {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: 'Google AI API key not configured' }, { status: 500 });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${taskId}?key=${apiKey}`,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (!response.ok) {
        return NextResponse.json({ error: `Veo status error: ${response.status}` }, { status: response.status });
      }

      const data = await response.json();
      const isDone = data.done === true;
      let videoUrl: string | null = null;

      if (isDone && data.response?.generatedSamples) {
        videoUrl = data.response.generatedSamples[0]?.video?.uri || null;
      }

      return NextResponse.json({
        taskId,
        engine: 'veo',
        status: isDone ? (data.error ? 'failed' : 'completed') : 'in_progress',
        progress: isDone ? 100 : 30,
        videoUrl,
      });
    }

    return NextResponse.json({ error: 'Unknown engine' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Status check error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
