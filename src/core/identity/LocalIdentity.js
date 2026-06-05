import { randomUUID } from 'crypto';

export class LocalIdentity {
  constructor({ username, tcpPort }) {
    this.nodeId = randomUUID();
    this.username = username;
    this.tcpPort = tcpPort;
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    return {
      nodeId: this.nodeId,
      username: this.username,
      tcpPort: this.tcpPort,
      createdAt: this.createdAt,
    };
  }
}
