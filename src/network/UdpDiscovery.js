import dgram from 'dgram';
import { MessageFactory } from '../core/messages/MessageFactory.js';
import { MessageParser } from '../core/parsers/MessageParser.js';

export class UdpDiscovery {
  constructor({
    username,
    tcpPort,
    eventBus,
    discoveryPort = 55555,
    broadcastAddress = '192.168.100.252', //In the future change this to broadcast '255.255.255.255'
    announceIntervalMs = 5000,
  }) {
    this.username = username;
    this.tcpPort = tcpPort;
    this.eventBus = eventBus;
    this.discoveryPort = discoveryPort;
    this.broadcastAddress = broadcastAddress;
    this.announceIntervalMs = announceIntervalMs;

    this.socket = dgram.createSocket({
      type: 'udp4',
      reuseAddr: true,
    });

    this.intervalId = null;
  }

  start() {
    this.socket.on('message', (data, remoteInfo) => {
      this.handleIncomingMessage(data, remoteInfo);
    });

    this.socket.on('error', (error) => {
      this.eventBus.emit('discovery:error', {
        error,
      });
    });

    this.socket.bind(this.discoveryPort, () => {
      this.socket.setBroadcast(true);

      this.eventBus.emit('discovery:listening', {
        port: this.discoveryPort,
      });

      this.announce();

      this.intervalId = setInterval(() => {
        this.announce();
      }, this.announceIntervalMs);
    });
  }

  announce() {
    const message = MessageFactory.createPeerAnnounceMessage({
      from: this.username,
      port: this.tcpPort,
    });

    const serializedMessage = Buffer.from(JSON.stringify(message) + '\n');

    this.socket.send(
      serializedMessage,
      0,
      serializedMessage.length,
      this.discoveryPort,
      this.broadcastAddress,
    );
  }

  handleIncomingMessage(data, remoteInfo) {
    const results = MessageParser.parse(data);

    for (const result of results) {
      if (!result.success) {
        this.eventBus.emit('discovery:invalid_message', {
          error: result.error,
          rawMessage: result.rawMessage,
          remoteInfo,
        });

        continue;
      }

      const message = result.message;

      if (message.type !== 'peer_announce') {
        continue;
      }

      if (
        message.from === this.username &&
        message.payload.port === this.tcpPort
      ) {
        return;
      }

      this.eventBus.emit('peer:discovered', {
        username: message.from,
        host: remoteInfo.address,
        port: message.payload.port,
        discoveredAt: new Date().toISOString(),
      });
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.socket.close();
  }
}
