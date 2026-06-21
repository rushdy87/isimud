import { EventBus } from './events/EventBus.js';
import { ConnectionRegistry } from './connections/ConnectionRegistry.js';
import { PeerRegistry } from './peers/PeerRegistry.js';
import { IdentityStore } from './identity/IdentityStore.js';
import { LocalIdentity } from './identity/LocalIdentity.js';
import { MessageFactory } from './messages/MessageFactory.js';
import { TcpTransport } from '../network/TcpTransport.js';
import { UdpDiscovery } from '../network/UdpDiscovery.js';
import { CommandHandler } from '../commands/CommandHandler.js';
import { TerminalUI } from '../cli/TerminalUI.js';

export class IsimudNode {
  constructor({ config }) {
    this.config = config;

    this.eventBus = new EventBus();
    this.peerRegistry = new PeerRegistry();
    this.connectionRegistry = new ConnectionRegistry();

    this.identity = this.#createIdentity();

    this.transport = new TcpTransport({
      eventBus: this.eventBus,
    });

    this.discovery = new UdpDiscovery({
      identity: this.identity,
      eventBus: this.eventBus,
      discoveryPort: config.discovery.port,
      targetPorts: config.discovery.targetPorts,
      broadcastAddress: config.discovery.broadcastAddress,
      announceIntervalMs: config.discovery.announceIntervalMs,
    });

    this.commandHandler = new CommandHandler({
      identity: this.identity,
      port: config.network.tcpPort,
      transport: this.transport,
      peerRegistry: this.peerRegistry,
      connectionRegistry: this.connectionRegistry,
    });

    this.terminalUI = new TerminalUI({
      commandHandler: this.commandHandler,
    });

    this.#registerEventHandlers();
  }

  start() {
    this.transport.listen(this.config.network.tcpPort);
    this.discovery.start();
    this.terminalUI.start();
  }

  #createIdentity() {
    const identityStore = new IdentityStore({
      filePath: `.isimud/${this.config.identity.username}.identity.json`,
    });

    const savedIdentity = identityStore.loadOrCreate({
      username: this.config.identity.username,
      tcpPort: this.config.identity.tcpPort,
    });

    return new LocalIdentity(savedIdentity);
  }

  #registerEventHandlers() {
    this.eventBus.on('network:listening', this.#onNetworkListening.bind(this));
    this.eventBus.on('peer:connected', this.#onPeerConnected.bind(this));
    this.eventBus.on('peer:disconnected', this.#onPeerDisconnected.bind(this));
    this.eventBus.on('message:received', this.#onMessageReceived.bind(this));
    this.eventBus.on('message:invalid', this.#onMessageInvalid.bind(this));
    this.eventBus.on('network:error', this.#onNetworkError.bind(this));
    this.eventBus.on(
      'network:server_error',
      this.#onNetworkServerError.bind(this),
    );
    this.eventBus.on(
      'discovery:listening',
      this.#onDiscoveryListening.bind(this),
    );
    this.eventBus.on('peer:discovered', this.#onPeerDiscovered.bind(this));
    this.eventBus.on('discovery:error', this.#onDiscoveryError.bind(this));
  }

  #onNetworkListening({ port }) {
    console.log(`Isimud listening on port ${port}`);
    console.log('Type /help for commands');
  }

  #onPeerConnected({ peerId }) {
    this.connectionRegistry.addConnection({
      connectionId: peerId,
    });

    console.log(`Peer connected: ${peerId}`);

    const helloMessage = MessageFactory.createHelloMessage({
      identity: this.identity,
    });

    this.transport.sendToAll(helloMessage);
  }

  #onPeerDisconnected({ peerId }) {
    const connection = this.connectionRegistry.removeConnection(peerId);

    if (connection?.nodeId) {
      this.peerRegistry.updatePeer(connection.nodeId, {
        status: 'disconnected',
        disconnectedAt: new Date().toISOString(),
      });
    }

    console.log(`Peer disconnected: ${peerId}`);
  }

  #onMessageReceived({ peerId, message }) {
    if (message.type === 'chat_message') {
      console.log(`\n[${message.from.username}]: ${message.payload.body}`);
    }

    if (message.type === 'hello') {
      this.#handleHelloMessage({ peerId, message });
    }

    this.terminalUI.rl.prompt();
  }

  #handleHelloMessage({ peerId, message }) {
    const remoteNodeId = message.from.nodeId;
    const remoteHost = peerId.split(':')[0] || 'localhost';

    this.connectionRegistry.bindNode({
      connectionId: peerId,
      nodeId: remoteNodeId,
    });

    const existingPeer = this.peerRegistry.getPeer(remoteNodeId);

    const peerData = {
      username: message.from.username,
      host: remoteHost,
      tcpPort: message.payload.tcpPort,
      status: 'connected',
      connectedAt: new Date().toISOString(),
    };

    if (existingPeer) {
      this.peerRegistry.updatePeer(remoteNodeId, peerData);
    } else {
      this.peerRegistry.addPeer({
        nodeId: remoteNodeId,
        ...peerData,
      });
    }

    const wasAlreadyConnected = existingPeer?.status === 'connected';

    if (!wasAlreadyConnected) {
      console.log(`\n${message.from.username} joined`);
    }
  }

  #onMessageInvalid({ peerId, rawMessage }) {
    console.log(`Invalid message from ${peerId}: ${rawMessage}`);
  }

  #onNetworkError({ peerId, error }) {
    console.log(`Network error with ${peerId}: ${error.message}`);
  }

  #onNetworkServerError({ port, error }) {
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
  }

  #onDiscoveryListening({ port }) {
    console.log(`UDP discovery listening on port ${port}`);
  }

  #onPeerDiscovered({ nodeId, username, host, port, discoveredAt }) {
    const existingPeer = this.peerRegistry.getPeer(nodeId);

    if (existingPeer) {
      this.peerRegistry.updatePeer(nodeId, {
        username,
        host,
        tcpPort: port,
        discoveredAt,
        status:
          existingPeer.status === 'connected' ||
          existingPeer.status === 'connecting'
            ? existingPeer.status
            : 'discovered',
      });

      this.#autoConnectToPeer({
        nodeId,
        host,
        port,
      });

      return;
    }

    this.peerRegistry.addPeer({
      nodeId,
      username,
      host,
      tcpPort: port,
      discoveredAt,
      status: 'discovered',
    });

    console.log(`Discovered peer: ${username} at ${host}:${port}`);

    this.#autoConnectToPeer({
      nodeId,
      host,
      port,
    });
  }

  #onDiscoveryError({ error }) {
    console.log(`Discovery error: ${error.message}`);
  }

  #autoConnectToPeer({ nodeId, host, port }) {
    if (!this.config.discovery.autoConnect) {
      return;
    }

    const existingPeer = this.peerRegistry.getPeer(nodeId);

    if (existingPeer?.status === 'connected') {
      return;
    }

    if (existingPeer?.status === 'connecting') {
      return;
    }

    const alreadyConnected = this.connectionRegistry
      .getAllConnections()
      .some((connection) => connection.nodeId === nodeId);

    if (alreadyConnected) {
      return;
    }

    this.peerRegistry.updatePeer(nodeId, {
      status: 'connecting',
    });

    this.transport.connect(host, port);
  }
}
