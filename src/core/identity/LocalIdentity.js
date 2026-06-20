export class LocalIdentity {
  constructor({ nodeId, username, tcpPort }) {
    this.nodeId = nodeId;
    this.username = username;
    this.tcpPort = tcpPort;
  }

  toJSON() {
    return {
      nodeId: this.nodeId,
      username: this.username,
      tcpPort: this.tcpPort,
    };
  }
}
