'use client';

import { useEffect, useState } from 'react';

export interface SSEEventPayload {
  type: string;
  timestamp: string;
  data: any;
}

export function useEvents(onEvent?: (event: SSEEventPayload) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEventPayload | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/events');

      eventSource.addEventListener('connected', () => {
        setIsConnected(true);
      });

      eventSource.addEventListener('message', (e) => {
        try {
          const parsed: SSEEventPayload = JSON.parse(e.data);
          setLastEvent(parsed);
          if (onEvent) onEvent(parsed);
        } catch (err) {
          console.error('Error parsing SSE event:', err);
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.error('Failed to initialize SSE EventSource:', e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [onEvent]);

  return { isConnected, lastEvent };
}
