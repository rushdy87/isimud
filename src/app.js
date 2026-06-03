import { EventBus } from './core/events/EventBus.js';
import { TcpTransport } from './network/TcpTransport.js';
import { CommandHandler } from './commands/CommandHandler.js';
import { TerminalUI } from './cli/TerminalUI.js';
import { MessageFactory } from './core/messages/MessageFactory.js';
import { PeerRegistry } from './core/peers/PeerRegistry.js';

const username = process.argv[2] || 'anonymous';
const port = Number(process.argv[3]) || 4000;

const eventBus = new EventBus();
const peerRegistry = new PeerRegistry();

const transport = new TcpTransport({ eventBus });

const commandHandler = new CommandHandler({
  username,
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
  peerRegistry.addPeer({
    peerId,
  });

  console.log(`Peer connected: ${peerId}`);

  const helloMessage = MessageFactory.createHelloMessage({
    from: username,
    port,
  });
  transport.sendToAll(helloMessage);
});

eventBus.on('peer:disconnected', ({ peerId }) => {
  peerRegistry.removePeer(peerId);
  console.log(`Peer disconnected: ${peerId}`);
});

eventBus.on('message:received', ({ peerId, message }) => {
  if (message.type === 'chat_message') {
    console.log(`\n[${message.from}]: ${message.payload.body}`);
  }

  if (message.type === 'hello') {
    peerRegistry.updatePeer(peerId, {
      username: message.from,
      port: message.payload.port,
    });

    console.log(`\n${message.from} joined from ${peerId}`);
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

transport.listen(port);
terminalUI.start();
