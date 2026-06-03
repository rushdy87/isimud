import { MessageValidator } from '../messages/MessageValidator.js';

export class MessageParser {
  static parse(rawData) {
    const messages = [];

    const chunks = rawData.toString().trim().split('\n');

    for (const rawMessage of chunks) {
      try {
        const parsedMessage = JSON.parse(rawMessage);

        const isValid = MessageValidator.validate(parsedMessage);

        if (!isValid) {
          messages.push({
            success: false,
            error: 'Invalid message structure',
            rawMessage,
          });

          continue;
        }

        messages.push({
          success: true,
          message: parsedMessage,
        });
      } catch {
        messages.push({
          success: false,
          error: 'Invalid JSON',
          rawMessage,
        });
      }
    }

    return messages;
  }
}
