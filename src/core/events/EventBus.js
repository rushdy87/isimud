export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, listener) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName).push(listener);
  }

  emit(eventName, payload) {
    const listeners = this.listeners.get(eventName) || [];

    for (const listener of listeners) {
      listener(payload);
    }
  }
}

/** NOTES and Explanation:
 * The EventBus class is a simple implementation of the publish-subscribe pattern.
 * It allows different parts of the application to communicate with each other
 * without being tightly coupled.
 *
 * Methods:
 * - on(eventName, listener): Registers a listener function for a specific event.
 * - emit(eventName, payload): Emits an event, calling all registered listeners with the provided payload.
 */
