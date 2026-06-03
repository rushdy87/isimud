export class HelpCommand {
  execute() {
    console.log(`
Commands:
  /connect <host> <port>   Connect to another peer
  /send <message>          Send message to all connected peers
  /help                    Show commands
`);
  }
}

/** NOTES and Explanation:
 * The HelpCommand class is responsible for handling the /help command.
 * It provides a list of available commands and their usage instructions to the user.
 *
 * Methods:
 * - execute(): Executes the /help command and displays the list of commands.
 */
