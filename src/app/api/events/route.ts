import { NextRequest } from 'next/server';
import { eventHub } from '@/lib/events/event-hub';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection ping
      const initialMessage = `event: connected\ndata: ${JSON.stringify({ status: 'connected', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      const unsubscribe = eventHub.subscribe((payload) => {
        try {
          const sseData = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        } catch (err) {
          console.error('Error writing to SSE stream:', err);
        }
      });

      // Send periodic heartbeat ping every 15 seconds to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`));
        } catch (e) {
          clearInterval(interval);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        unsubscribe();
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
