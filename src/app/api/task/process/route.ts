import { NextRequest } from 'next/server';
import { agentOrder, getAgent } from '@/lib/agents';
import { callAgent } from '@/lib/openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const userRequest = searchParams.get('request');

  if (!taskId || !userRequest) {
    return new Response('Task ID and request required', { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let context = '';
        const totalAgents = agentOrder.length;

        for (let i = 0; i < agentOrder.length; i++) {
          const agentId = agentOrder[i];
          const agent = getAgent(agentId);
          
          if (!agent) continue;

          // エージェント開始イベント
          const startEvent = {
            type: 'agent_start',
            agent: agentId,
            name: agent.name,
            role: agent.role,
            progress: Math.round((i / totalAgents) * 100),
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(startEvent)}\\n\\n`));

          // エージェント処理中イベント
          const processingEvent = {
            type: 'agent_processing',
            agent: agentId,
            message: `${agent.name} is working...`,
            progress: Math.round((i / totalAgents) * 100),
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(processingEvent)}\\n\\n`));

          try {
            // AIエージェントを呼び出し
            const result = await callAgent(
              agent.systemPrompt,
              userRequest,
              context
            );

            context += `\\n\\n## ${agent.name} (${agent.role})の結果:\\n${result}`;

            // エージェント完了イベント
            const completeEvent = {
              type: 'agent_complete',
              agent: agentId,
              name: agent.name,
              result: result.substring(0, 200) + (result.length > 200 ? '...' : ''),
              progress: Math.round(((i + 1) / totalAgents) * 100),
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeEvent)}\\n\\n`));

          } catch (error) {
            console.error(`Error processing agent ${agentId}:`, error);
            const errorEvent = {
              type: 'agent_error',
              agent: agentId,
              error: error instanceof Error ? error.message : 'Unknown error',
              progress: Math.round((i / totalAgents) * 100),
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\\n\\n`));
          }

          // 少し待機（リアルタイム感を出すため）
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 完了イベント
        const finalEvent = {
          type: 'task_complete',
          taskId,
          progress: 100,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalEvent)}\\n\\n`));

        controller.close();
      } catch (error) {
        console.error('Stream error:', error);
        const errorEvent = {
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\\n\\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
