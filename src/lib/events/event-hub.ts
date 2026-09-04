import { EventEmitter } from 'events';

export type EventType =
  | 'payment.created'
  | 'payment.success'
  | 'payment.failed'
  | 'payment.pending'
  | 'payment.recovered'
  | 'recovery.started'
  | 'recovery.attempt'
  | 'recovery.completed'
  | 'recovery.stopped'
  | 'incident.detected'
  | 'incident.resolved'
  | 'prediction.updated'
  | 'demo.traffic_burst';

export interface AppEventPayload {
  type: EventType;
  timestamp: string;
  data: any;
}

class EventHub extends EventEmitter {
  private clients: Set<(payload: AppEventPayload) => void> = new Set();

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  public subscribe(callback: (payload: AppEventPayload) => void) {
    this.clients.add(callback);
    return () => {
      this.clients.delete(callback);
    };
  }

  public broadcast(type: EventType, data: any) {
    const payload: AppEventPayload = {
      type,
      timestamp: new Date().toISOString(),
      data,
    };

    this.emit(type, payload);

    // Push to all active SSE subscribers
    this.clients.forEach((client) => {
      try {
        client(payload);
      } catch (err) {
        console.error('Error broadcasting event to SSE client:', err);
      }
    });
  }

  public getSubscriberCount(): number {
    return this.clients.size;
  }
}

// Singleton EventHub
const globalForEvents = globalThis as unknown as {
  eventHub: EventHub | undefined;
};

export const eventHub = globalForEvents.eventHub ?? new EventHub();

if (process.env.NODE_ENV !== 'production') globalForEvents.eventHub = eventHub;
