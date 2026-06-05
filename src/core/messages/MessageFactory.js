import { randomUUID } from 'crypto';
import { MessageTypes } from './MessageTypes.js';

export class MessageFactory {
  static createBaseMessage({ type, from, payload = {} }) {
    return {
      id: randomUUID(),
      version: 1,
      type,
      from,
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  static createHelloMessage({ identity }) {
    return this.createBaseMessage({
      type: MessageTypes.HELLO,
      from: {
        nodeId: identity.nodeId,
        username: identity.username,
      },
      payload: {
        tcpPort: identity.tcpPort,
      },
    });
  }

  static createChatMessage({ identity, body }) {
    return this.createBaseMessage({
      type: MessageTypes.CHAT_MESSAGE,
      from: {
        nodeId: identity.nodeId,
        username: identity.username,
      },
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

  static createPeerAnnounceMessage({ identity }) {
    return this.createBaseMessage({
      type: MessageTypes.PEER_ANNOUNCE,
      from: {
        nodeId: identity.nodeId,
        username: identity.username,
      },
      payload: {
        tcpPort: identity.tcpPort,
      },
    });
  }
}
