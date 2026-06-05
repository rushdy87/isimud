export class HelpCommand {
  execute() {
    console.log(`
Commands:
  /connect <host> <port>        Connect to another peer manually
  /connect-peer <username>      Connect to discovered peer by username
  /send <message>               Send message to all connected peers
  /peers                        Show known peers
  /whoami                       Show current peer info
  /help                         Show commands
`);
  }
}
