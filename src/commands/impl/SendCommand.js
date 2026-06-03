import { MessageFactory } from '../../core/messages/MessageFactory.js';

export class SendCommand {
  constructor({ username, transport }) {
    this.username = username;
    this.transport = transport;
  }

  execute(args) {
    const body = args.join(' ');

    if (!body) {
      console.log('Usage: /send <message>');
      return;
    }

    const message = MessageFactory.createChatMessage({
      from: this.username,
      body,
    });

    this.transport.sendToAll(message);

    console.log(`[me]: ${body}`);
  }
}

/** NOTES and Explanation:
 * The SendCommand class is responsible for handling the /send command.
 * It validates the input arguments, creates a chat message using the MessageFactory, and sends it to all connected peers.
 *
 * Methods:
 * - execute(args): Executes the /send command with the provided arguments.
 */
