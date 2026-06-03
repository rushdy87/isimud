export class UnknownCommand {
  execute(commandName) {
    console.log(`Unknown command: ${commandName}`);
    console.log('Type /help');
  }
}

/** NOTES and Explanation:
 * The UnknownCommand class is responsible for handling any unrecognized commands entered by the user.
 * It provides feedback to the user about the unknown command and suggests using the /help command for guidance.
 *
 * Methods:
 * - execute(commandName): Executes the unknown command handler with the provided command name.
 */
