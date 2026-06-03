import { randomUUID } from 'crypto';
import { MessageTypes } from './MessageTypes.js';

export class MessageFactory {
  static createBaseMessage({ type, from, payload = {} }) {
    return {
      id: randomUUID(), // Unique identifier for the message
      version: 1, // Versioning for future compatibility
      type, // Type of the message (e.g., 'hello', 'chat_message', 'system')
      from, // Sender of the message
      payload, // Additional data specific to the message type
      timestamp: new Date().toISOString(), // Time when the message was created
    };
  }

  static createHelloMessage({ from, port }) {
    return this.createBaseMessage({
      type: MessageTypes.HELLO,
      from,
      payload: {
        port,
      },
    });
  }

  static createChatMessage({ from, body }) {
    return this.createBaseMessage({
      type: MessageTypes.CHAT_MESSAGE,
      from,
      payload: {
        body,
      },
    });
  }

  static createSystemMessage({ body }) {
    return this.createBaseMessage({
      type: MessageTypes.SYSTEM,
      from: 'system',
      payload: {
        body,
      },
    });
  }
}
