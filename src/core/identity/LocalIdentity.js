export class LocalIdentity {
  constructor({ nodeId, username, tcpPort, createdAt }) {
    if (!nodeId) {
      throw new Error('LocalIdentity requires nodeId');
    }

    if (!username) {
      throw new Error('LocalIdentity requires username');
    }

    if (!tcpPort) {
      throw new Error('LocalIdentity requires tcpPort');
    }

    this.nodeId = nodeId;
    this.username = username;
    this.tcpPort = tcpPort;
    this.createdAt = createdAt ?? new Date().toISOString();
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
