type Events =
  | "loginRequired"
  | "loading"
  | "warning"
  | "error"
  | "info"
  | "success"
  | "updateTagConfig"
  | "nWarning";

type EventHandlerMap = {
  loginRequired: () => void;
  loading: (msg: string, duration: number) => void;
  warning: (msg: string, duration: number) => void;
  error: (msg: string, duration: number, details?: any) => void;
  info: (msg: string, duration: number) => void;
  success: (msg: string, duration: number) => void;
  updateTagConfig: (data: any) => void;
  nWarning: (data: any) => void;
};

class EventEmitter {
  private events: Partial<Record<Events, Set<(...args: any[]) => void>>> = {};

  emit<K extends Events>(event: K, ...args: Parameters<EventHandlerMap[K]>) {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }

  on<K extends Events>(event: K, listener: EventHandlerMap[K]) {
    if (!this.events[event]) {
      this.events[event] = new Set();
    }
    this.events[event]?.add(listener);
  }

  off<K extends Events>(event: K, listener: EventHandlerMap[K]) {
    const listeners = this.events[event];
    if (listeners) {
      listeners.delete(listener);
    }
  }
}

const Emitter = new EventEmitter();

export default Emitter;
