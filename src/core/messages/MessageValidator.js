import { MessageTypes } from './MessageTypes.js';

export class MessageValidator {
  static validate(message) {
    if (!message || typeof message !== 'object') {
      return false;
    }

    if (!message.id) {
      return false;
    }

    if (!message.version) {
      return false;
    }

    if (!message.type) {
      return false;
    }

    if (!Object.values(MessageTypes).includes(message.type)) {
      return false;
    }

    if (!message.timestamp) {
      return false;
    }

    return true;
  }
}
