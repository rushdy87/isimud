import { UnknownCommand } from './impl/UnknownCommand.js';

export class CommandHandler {
  constructor(commandRegistry) {
    this.commandRegistry = commandRegistry;
    this.unknownCommand = new UnknownCommand();
  }

  async handle(input) {
    const [commandName, ...args] = input.trim().split(' ');

    if (!commandName) {
      return;
    }

    const command = this.commandRegistry.get(commandName);

    if (!command) {
      await this.unknownCommand.execute(commandName);
      return;
    }

    try {
      await command.execute(args);
    } catch (error) {
      console.error(`Command failed: ${error.message}`);
    }
  }
}
