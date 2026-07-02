import { CommandRegistry } from './CommandRegistry.js';

import { ConnectCommand } from './impl/ConnectCommand.js';
import { SendCommand } from './impl/SendCommand.js';
import { HelpCommand } from './impl/HelpCommand.js';
import { PeersCommand } from './impl/PeersCommand.js';
import { WhoamiCommand } from './impl/WhoamiCommand.js';
import { ConnectPeerCommand } from './impl/ConnectPeerCommand.js';
import { ConnectionsCommand } from './impl/ConnectionsCommand.js';
import { SendToCommand } from './impl/SendToCommand.js';

export function createCommandRegistry({
  identity,
  port,
  transport,
  peerRegistry,
  connectionRegistry,
}) {
  const registry = new CommandRegistry();

  registry.register('/connect', new ConnectCommand({ transport }));

  registry.register(
    '/send',
    new SendCommand({
      identity,
      transport,
    }),
  );

  registry.register(
    '/send-to',
    new SendToCommand({
      identity,
      transport,
      peerRegistry,
      connectionRegistry,
    }),
  );

  registry.register('/help', new HelpCommand());

  registry.register(
    '/peers',
    new PeersCommand({
      peerRegistry,
    }),
  );

  registry.register(
    '/whoami',
    new WhoamiCommand({
      identity,
      port,
    }),
  );

  registry.register(
    '/connect-peer',
    new ConnectPeerCommand({
      transport,
      peerRegistry,
    }),
  );

  registry.register(
    '/connections',
    new ConnectionsCommand({
      connectionRegistry,
    }),
  );

  return registry;
}
