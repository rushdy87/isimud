import net from 'net';

import { MessageParser } from '../core/parsers/MessageParser.js';

export class TcpTransport {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.server = null;
    this.connections = new Map();
    this.parsers = new Map();
  }

  listen(port) {
    this.server = net.createServer((socket) => {
      const peerId = `${socket.remoteAddress}:${socket.remotePort}`;

      this.connections.set(peerId, socket);

      this.parsers.set(peerId, new MessageParser());

      this.eventBus.emit('peer:connected', { peerId });

      socket.on('data', (data) => {
        this.handleIncomingData(peerId, data);
      });

      socket.on('close', () => {
        this.connections.delete(peerId);
        this.eventBus.emit('peer:disconnected', { peerId });
      });

      socket.on('error', (error) => {
        this.eventBus.emit('network:error', { peerId, error });
      });
    });

    this.server.on('error', (error) => {
      this.eventBus.emit('network:server_error', { port, error });
    });

    this.server.listen(port, () => {
      this.eventBus.emit('network:listening', { port });
    });
  }

  connect(host, port) {
    const socket = net.createConnection({ host, port }, () => {
      const peerId = `${host}:${port}`;

      this.connections.set(peerId, socket);

      this.parsers.set(peerId, new MessageParser());

      this.eventBus.emit('peer:connected', { peerId });
    });

    socket.on('data', (data) => {
      const peerId = `${host}:${port}`;
      this.handleIncomingData(peerId, data);
    });

    socket.on('close', () => {
      const peerId = `${host}:${port}`;
      this.connections.delete(peerId);
      this.parsers.delete(peerId);
      this.eventBus.emit('peer:disconnected', { peerId });
    });

    socket.on('error', (error) => {
      const peerId = `${host}:${port}`;
      this.eventBus.emit('network:error', { peerId, error });
    });
  }

  sendToAll(message) {
    const serializedMessage = JSON.stringify(message) + '\n';

    for (const socket of this.connections.values()) {
      socket.write(serializedMessage);
    }
  }

  handleIncomingData(peerId, data) {
    const parser = this.parsers.get(peerId);

    if (!parser) {
      this.eventBus.emit('message:invalid', {
        peerId,
        error: 'No parser found for connection',
        rawMessage: data.toString(),
      });

      return;
    }

    const results = parser.parse(data);

    for (const result of results) {
      if (!result.success) {
        this.eventBus.emit('message:invalid', {
          peerId,
          error: result.error,
          rawMessage: result.rawMessage,
        });

        continue;
      }

      this.eventBus.emit('message:received', {
        peerId,
        message: result.message,
      });
    }
  }

  sendToConnection(connectionId, message) {
    const socket = this.connections.get(connectionId);

    if (!socket) {
      return false;
    }

    const serializedMessage = JSON.stringify(message) + '\n';

    socket.write(serializedMessage);

    return true;
  }
}
