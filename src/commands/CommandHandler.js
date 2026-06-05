import { ConnectCommand } from './impl/ConnectCommand.js';
import { SendCommand } from './impl/SendCommand.js';
import { HelpCommand } from './impl/HelpCommand.js';
import { UnknownCommand } from './impl/UnknownCommand.js';
import { PeersCommand } from './impl/PeersCommand.js';
import { WhoamiCommand } from './impl/WhoamiCommand.js';
import { ConnectPeerCommand } from './impl/ConnectPeerCommand.js';
import { ConnectionsCommand } from './impl/ConnectionsCommand.js';

export class CommandHandler {
  constructor({ identity, port, transport, peerRegistry, connectionRegistry }) {
    this.commands = new Map();
    this.unknownCommand = new UnknownCommand();

    this.registerCommands({
      identity,
      port,
      transport,
      peerRegistry,
      connectionRegistry,
    });
  }

  registerCommands({
    identity,
    port,
    transport,
    peerRegistry,
    connectionRegistry,
  }) {
    this.commands.set(
      '/connect',
      new ConnectCommand({
        transport,
      }),
    );

    this.commands.set(
      '/send',
      new SendCommand({
        identity,
        transport,
      }),
    );

    this.commands.set('/help', new HelpCommand());

    this.commands.set(
      '/peers',
      new PeersCommand({
        peerRegistry,
      }),
    );

    this.commands.set(
      '/whoami',
      new WhoamiCommand({
        identity,
        port,
      }),
    );

    this.commands.set(
      '/connect-peer',
      new ConnectPeerCommand({
        transport,
        peerRegistry,
      }),
    );

    this.commands.set(
      '/connections',
      new ConnectionsCommand({
        connectionRegistry,
      }),
    );
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
