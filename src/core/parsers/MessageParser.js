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

// TODO: We will use "Length-Prefixed Messages" in the future to handle message framing properly over TCP
// For now, we will assume that each message is sent as a single JSON string followed by a newline character
// This is a simple approach for demonstration purposes, but it may not be reliable in all cases (e.g., if messages are large or if multiple messages are sent in quick succession)
