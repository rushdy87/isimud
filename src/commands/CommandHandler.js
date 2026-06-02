import { MessageFactory } from '../core/messages/MessageFactory.js';

export class CommandHandler {
  constructor({ username, transport, eventBus }) {
    this.username = username;
    this.transport = transport;
    this.eventBus = eventBus;
  }

  handle(input) {
    const [command, ...args] = input.trim().split(' ');

    switch (command) {
      case '/connect':
        return this.handleConnect(args);

      case '/send':
        return this.handleSend(args);

      case '/help':
        return this.handleHelp();

      default:
        return this.handleUnknownCommand(command);
    }
  }

  handleConnect(args) {
    const [host, port] = args;

    if (!host || !port) {
      console.log('Usage: /connect <host> <port>');
      return;
    }

    this.transport.connect(host, Number(port));
  }

  handleSend(args) {
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

  handleHelp() {
    console.log(`
Commands:
  /connect <host> <port>   Connect to another peer
  /send <message>          Send message to all connected peers
  /help                    Show commands
`);
  }

  handleUnknownCommand(command) {
    console.log(`Unknown command: ${command}`);
    console.log('Type /help');
  }
}

/** NOTES and Explanation:
 * The CommandHandler class is responsible for parsing user input from the terminal
 * and executing the corresponding actions. It supports commands for connecting to peers,
 * sending messages, and displaying help information.
 *
 * Methods:
 * - handle(input): Main method to process user input and route to specific command handlers.
 * - handleConnect(args): Handles the /connect command to establish a connection to another peer.
 * - handleSend(args): Handles the /send command to send a chat message to all connected peers.
 * - handleHelp(): Displays available commands and their usage.
 * - handleUnknownCommand(command): Handles unrecognized commands and prompts the user to check the help.
 */
