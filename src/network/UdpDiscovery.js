import dgram from 'dgram';
import { MessageFactory } from '../core/messages/MessageFactory.js';
import { DatagramMessageParser } from '../core/parsers/DatagramMessageParser.js';

export class UdpDiscovery {
  constructor({
    identity,
    eventBus,
    discoveryPort = 55555,
    broadcastAddress = '192.168.100.251', //In the future change this to broadcast '255.255.255.255'
    announceIntervalMs = 5000,
  }) {
    this.identity = identity;
    this.eventBus = eventBus;
    this.discoveryPort = discoveryPort;
    this.broadcastAddress = broadcastAddress;
    this.announceIntervalMs = announceIntervalMs;

    this.socket = dgram.createSocket({
      type: 'udp4',
      reuseAddr: true,
    });

    this.parser = new DatagramMessageParser();

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
      identity: this.identity,
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
    const results = this.parser.parse(data);

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

      if (message.from.nodeId === this.identity.nodeId) {
        return;
      }

      this.eventBus.emit('peer:discovered', {
        nodeId: message.from.nodeId,
        username: message.from.username,
        host: remoteInfo.address,
        port: message.payload.tcpPort,
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
