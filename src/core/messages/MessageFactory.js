import { randomUUID } from 'crypto';
import { MessageTypes } from './MessageTypes.js';

export class MessageFactory {
  static createHelloMessage({ from }) {
    return {
      id: randomUUID(),
      type: MessageTypes.HELLO,
      from,
      timestamp: new Date().toISOString(),
    };
  }

  static createChatMessage({ from, body }) {
    return {
      id: randomUUID(),
      type: MessageTypes.CHAT_MESSAGE,
      from,
      body,
      timestamp: new Date().toISOString(),
    };
  }

  static createSystemMessage({ body }) {
    return {
      id: randomUUID(),
      type: MessageTypes.SYSTEM,
      body,
      timestamp: new Date().toISOString(),
    };
  }
}
