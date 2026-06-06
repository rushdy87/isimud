import { MessageValidator } from '../messages/MessageValidator.js';

export class DatagramMessageParser {
  parse(data) {
    const rawMessage = data.toString().trim();

    if (!rawMessage) {
      return [
        {
          success: false,
          error: 'Empty datagram',
          rawMessage,
        },
      ];
    }

    try {
      const message = JSON.parse(rawMessage);

      const isValid = MessageValidator.validate(message);

      if (!isValid) {
        return [
          {
            success: false,
            error: 'Invalid message structure',
            rawMessage,
          },
        ];
      }

      return [
        {
          success: true,
          message,
        },
      ];
    } catch {
      return [
        {
          success: false,
          error: 'Invalid JSON',
          rawMessage,
        },
      ];
    }
  }
}
