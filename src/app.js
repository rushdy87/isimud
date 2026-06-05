import { EventBus } from './core/events/EventBus.js';
import { MessageFactory } from './core/messages/MessageFactory.js';
import { PeerRegistry } from './core/peers/PeerRegistry.js';
import { LocalIdentity } from './core/identity/LocalIdentity.js';
import { TcpTransport } from './network/TcpTransport.js';
import { UdpDiscovery } from './network/UdpDiscovery.js';
import { CommandHandler } from './commands/CommandHandler.js';
import { TerminalUI } from './cli/TerminalUI.js';

const username = process.argv[2] || 'anonymous';
const port = Number(process.argv[3]) || 4000;

const eventBus = new EventBus();
const peerRegistry = new PeerRegistry();

const transport = new TcpTransport({ eventBus });
const identity = new LocalIdentity({
  username,
  tcpPort: port,
});

const discovery = new UdpDiscovery({
  identity,
  eventBus,
});

const commandHandler = new CommandHandler({
  identity,
  port,
  transport,
  peerRegistry,
});

const terminalUI = new TerminalUI({ commandHandler });

eventBus.on('network:listening', ({ port }) => {
  console.log(`Isimud listening on port ${port}`);
  console.log('Type /help for commands');
});

eventBus.on('peer:connected', ({ peerId }) => {
  console.log(`Peer connected: ${peerId}`);

  const helloMessage = MessageFactory.createHelloMessage({
    identity,
  });

  transport.sendToAll(helloMessage);
});

eventBus.on('peer:disconnected', ({ peerId }) => {
  console.log(`Peer disconnected: ${peerId}`);
});

eventBus.on('message:received', ({ peerId, message }) => {
  if (message.type === 'chat_message') {
    console.log(`\n[${message.from.username}]: ${message.payload.body}`);
  }

  if (message.type === 'hello') {
    const remoteNodeId = message.from.nodeId;

    const existingPeer = peerRegistry.getPeer(remoteNodeId);

    if (existingPeer) {
      peerRegistry.updatePeer(remoteNodeId, {
        username: message.from.username,
        port: message.payload.tcpPort,
        status: 'connected',
        connectedAt: new Date().toISOString(),
      });
    } else {
      peerRegistry.addPeer({
        nodeId: remoteNodeId,
        username: message.from.username,
        port: message.payload.tcpPort,
        status: 'connected',
      });
    }

    console.log(`\n${message.from.username} joined`);
  }

  terminalUI.rl.prompt();
});

eventBus.on('message:invalid', ({ peerId, rawMessage }) => {
  console.log(`Invalid message from ${peerId}: ${rawMessage}`);
});

eventBus.on('network:error', ({ peerId, error }) => {
  console.log(`Network error with ${peerId}: ${error.message}`);
});

eventBus.on('network:server_error', ({ port, error }) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use.`);
    console.log(`Try another port, for example: ${port + 1}`);
    process.exit(1);
  }

  if (error.code === 'EACCES') {
    console.log(`Permission denied for port ${port}.`);
    console.log('Try using a port greater than 1024.');
    process.exit(1);
  }

  console.log(`Server error on port ${port}: ${error.message}`);
  process.exit(1);
});

eventBus.on('discovery:listening', ({ port }) => {
  console.log(`UDP discovery listening on port ${port}`);
});

eventBus.on(
  'peer:discovered',
  ({ nodeId, username, host, port, discoveredAt }) => {
    const existingPeer = peerRegistry.getPeer(nodeId);

    if (existingPeer) {
      peerRegistry.updatePeer(nodeId, {
        username,
        host,
        port,
        discoveredAt,
        status:
          existingPeer.status === 'connected' ? 'connected' : 'discovered',
      });

      return;
    }

    peerRegistry.addPeer({
      nodeId,
      username,
      host,
      port,
      status: 'discovered',
    });

    console.log(`Discovered peer: ${username} at ${host}:${port}`);
  },
);

eventBus.on('discovery:error', ({ error }) => {
  console.log(`Discovery error: ${error.message}`);
});

transport.listen(port);
discovery.start();
terminalUI.start();
