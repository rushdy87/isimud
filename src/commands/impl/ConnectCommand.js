export class ConnectCommand {
  constructor({ transport }) {
    this.transport = transport;
  }

  execute(args) {
    const [host, port] = args;

    if (!host || !port) {
      console.log('Usage: /connect <host> <port>');
      return;
    }

    const numericPort = Number(port);

    if (Number.isNaN(numericPort)) {
      console.log('Port must be a number');
      return;
    }

    this.transport.connect(host, numericPort);
  }
}

/** NOTES and Explanation:
 * The ConnectCommand class is responsible for handling the /connect command.
 * It validates the input arguments and uses the transport layer to establish a connection to another peer.
 *
 * Methods:
 * - execute(args): Executes the /connect command with the provided arguments.
 */
