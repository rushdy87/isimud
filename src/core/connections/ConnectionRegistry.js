export class ConnectionRegistry {
  constructor() {
    this.connections = new Map();
  }

  addConnection({ connectionId }) {
    const connection = {
      connectionId,
      nodeId: null,
      connectedAt: new Date().toISOString(),
    };

    this.connections.set(connectionId, connection);

    return connection;
  }

  bindNode({ connectionId, nodeId }) {
    const connection = this.connections.get(connectionId);

    if (!connection) {
      return null;
    }

    const updatedConnection = {
      ...connection,
      nodeId,
    };

    this.connections.set(connectionId, updatedConnection);

    return updatedConnection;
  }

  removeConnection(connectionId) {
    const connection = this.connections.get(connectionId);

    if (!connection) {
      return null;
    }

    this.connections.delete(connectionId);

    return connection;
  }

  getConnection(connectionId) {
    return this.connections.get(connectionId) || null;
  }

  findConnectionByNodeId(nodeId) {
    return (
      Array.from(this.connections.values()).find(
        (connection) => connection.nodeId === nodeId,
      ) || null
    );
  }

  getAllConnections() {
    return Array.from(this.connections.values());
  }
}
