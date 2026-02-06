export interface WireOutgoingEvent {
  direction: "outgoing";
  command: string;
  args: string[];
  timestamp: string;
}

export interface WireIncomingEvent {
  direction: "incoming";
  data: unknown;
  timestamp: string;
}

export type WireEvent = WireOutgoingEvent | WireIncomingEvent;

export type WireListener = (event: WireEvent) => void;

export class WireObserver {
  private listeners = new Set<WireListener>();

  subscribe(listener: WireListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emitOutgoing(command: string, args: string[]) {
    const event: WireOutgoingEvent = {
      direction: "outgoing",
      command,
      args,
      timestamp: new Date().toISOString(),
    };
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  emitIncoming(data: unknown) {
    const event: WireIncomingEvent = {
      direction: "incoming",
      data,
      timestamp: new Date().toISOString(),
    };
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
