export class ConnectionsCommand {
  constructor({ connectionRegistry }) {
    this.connectionRegistry = connectionRegistry;
  }

  execute() {
    const connections = this.connectionRegistry.getAllConnections();

    if (connections.length === 0) {
      console.log('No active connections.');
      return;
    }

    console.log('\nActive connections:');

    for (const connection of connections) {
      console.log(
        `- connectionId: ${connection.connectionId} | nodeId: ${connection.nodeId || 'unknown'} | connectedAt: ${connection.connectedAt}`,
      );
    }
  }
}
