export class HelpCommand {
  execute() {
    console.log(`
Commands:
  /connect <host> <port>        Connect to another peer manually
  /connect-peer <username>      Connect to discovered peer by username
  /send <message>               Send message to all connected peers
  /send-to <username> <message> Send private message to specific peer
  /peers                        Show known peers
  /connections                  Show active TCP connections
  /whoami                       Show current peer info
  /help                         Show commands
`);
  }
}
