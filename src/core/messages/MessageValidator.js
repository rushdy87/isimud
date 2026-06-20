import { MessageTypes } from './MessageTypes.js';

export class MessageValidator {
  static validate(message) {
    if (!message || typeof message !== 'object') {
      return false;
    }

    if (!this.#hasBaseFields(message)) {
      return false;
    }

    switch (message.type) {
      case MessageTypes.HELLO:
        return this.#validateHello(message);

      case MessageTypes.CHAT_MESSAGE:
        return this.#validateChatMessage(message);

      case MessageTypes.SYSTEM:
        return this.#validateSystem(message);

      case MessageTypes.PEER_ANNOUNCE:
        return this.#validatePeerAnnounce(message);

      default:
        return false;
    }
  }

  static #hasBaseFields(message) {
    return (
      typeof message.id === 'string' &&
      typeof message.version === 'number' &&
      typeof message.type === 'string' &&
      typeof message.timestamp === 'string'
    );
  }

  static #validateHello(message) {
    return (
      this.#hasValidPeerFrom(message) && this.#hasValidTcpPortPayload(message)
    );
  }

  static #validatePeerAnnounce(message) {
    return (
      this.#hasValidPeerFrom(message) && this.#hasValidTcpPortPayload(message)
    );
  }

  static #validateChatMessage(message) {
    return (
      this.#hasValidPeerFrom(message) &&
      message.payload &&
      typeof message.payload === 'object' &&
      typeof message.payload.body === 'string' &&
      message.payload.body.trim().length > 0
    );
  }

  static #validateSystem(message) {
    return (
      message.from === 'system' &&
      message.payload &&
      typeof message.payload === 'object' &&
      typeof message.payload.body === 'string' &&
      message.payload.body.trim().length > 0
    );
  }

  static #hasValidPeerFrom(message) {
    return (
      message.from &&
      typeof message.from === 'object' &&
      typeof message.from.nodeId === 'string' &&
      message.from.nodeId.trim().length > 0 &&
      typeof message.from.username === 'string' &&
      message.from.username.trim().length > 0
    );
  }

  static #hasValidTcpPortPayload(message) {
    return (
      message.payload &&
      typeof message.payload === 'object' &&
      Number.isInteger(message.payload.tcpPort) &&
      message.payload.tcpPort > 0 &&
      message.payload.tcpPort <= 65535
    );
  }
}
