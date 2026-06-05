export class WhoamiCommand {
  constructor({ identity }) {
    this.identity = identity;
  }

  execute() {
    console.log(`
You are:
  nodeId: ${this.identity.nodeId}
  username: ${this.identity.username}
  tcpPort: ${this.identity.tcpPort}
`);
  }
}
