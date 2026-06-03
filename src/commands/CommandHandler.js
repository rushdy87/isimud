import { ConnectCommand } from './impl/ConnectCommand.js';
import { SendCommand } from './impl/SendCommand.js';
import { HelpCommand } from './impl/HelpCommand.js';
import { UnknownCommand } from './impl/UnknownCommand.js';

export class CommandHandler {
  constructor({ username, transport }) {
    this.commands = new Map();

    this.unknownCommand = new UnknownCommand();

    this.registerCommands({ username, transport });
  }

  registerCommands({ username, transport }) {
    this.commands.set(
      '/connect',
      new ConnectCommand({
        transport,
      }),
    );

    this.commands.set(
      '/send',
      new SendCommand({
        username,
        transport,
      }),
    );

    this.commands.set('/help', new HelpCommand());
  }

  handle(input) {
    const [commandName, ...args] = input.trim().split(' ');

    if (!commandName) {
      return;
    }

    const command = this.commands.get(commandName);

    if (!command) {
      this.unknownCommand.execute(commandName);
      return;
    }

    command.execute(args);
  }
}
