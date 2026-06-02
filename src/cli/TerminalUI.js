import readline from 'readline';

export class TerminalUI {
  constructor({ commandHandler }) {
    this.commandHandler = commandHandler;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });
  }

  start() {
    this.rl.prompt();

    this.rl.on('line', (input) => {
      this.commandHandler.handle(input);
      this.rl.prompt();
    });
  }
}

/** NOTES and Explanation:
 * The TerminalUI class provides a simple command-line interface for the user to interact with the application. It uses Node.js's built-in readline module to read user input from the terminal.
 *
 * Methods:
 * - start(): Initializes the readline interface and sets up a listener for user input. When the user enters a line of input, it passes that input to the CommandHandler for processing.
 */
