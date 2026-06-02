import net from 'net';

export class TcpTransport {
  constructor({ eventBus }) {
    this.eventBus = eventBus;
    this.server = null;
    this.connections = new Map();
  }

  listen(port) {
    this.server = net.createServer((socket) => {
      const peerId = `${socket.remoteAddress}:${socket.remotePort}`;

      this.connections.set(peerId, socket);

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

    this.server.listen(port, () => {
      this.eventBus.emit('network:listening', { port });
    });
  }

  connect(host, port) {
    const socket = net.createConnection({ host, port }, () => {
      const peerId = `${host}:${port}`;

      this.connections.set(peerId, socket);

      this.eventBus.emit('peer:connected', { peerId });
    });

    socket.on('data', (data) => {
      const peerId = `${host}:${port}`;
      this.handleIncomingData(peerId, data);
    });

    socket.on('close', () => {
      const peerId = `${host}:${port}`;
      this.connections.delete(peerId);
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
    const messages = data.toString().trim().split('\n');

    for (const rawMessage of messages) {
      try {
        const message = JSON.parse(rawMessage);
        this.eventBus.emit('message:received', { peerId, message });
      } catch {
        this.eventBus.emit('message:invalid', { peerId, rawMessage });
      }
    }
  }
}
