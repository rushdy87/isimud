import { MessageValidator } from '../messages/MessageValidator.js';

export class StreamMessageParser {
  constructor() {
    this.buffer = '';
  }

  parse(data) {
    this.buffer += data.toString();

    const lines = this.buffer.split('\n');

    this.buffer = lines.pop() || '';

    const results = [];

    for (const line of lines) {
      const rawMessage = line.trim();

      if (!rawMessage) {
        continue;
      }

      try {
        const message = JSON.parse(rawMessage);

        const isValid = MessageValidator.validate(message);

        if (!isValid) {
          results.push({
            success: false,
            error: 'Invalid message structure',
            rawMessage,
          });

          continue;
        }

        results.push({
          success: true,
          message,
        });
      } catch {
        results.push({
          success: false,
          error: 'Invalid JSON',
          rawMessage,
        });
      }
    }

    return results;
  }

  clear() {
    this.buffer = '';
  }
}
