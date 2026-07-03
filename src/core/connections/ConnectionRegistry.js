import { Connection } from './Connection.js';

export class ConnectionRegistry {
  constructor() {
    this.connections = new Map();
  }

  add(connectionData) {
    const connection =
      connectionData instanceof Connection
        ? connectionData
        : new Connection(connectionData);

    this.connections.set(connection.connectionId, connection);

    return connection;
  }

  upsert(connectionData) {
    const existingConnection = this.getById(connectionData.connectionId);

    if (!existingConnection) {
      return this.add(connectionData);
    }

    if (connectionData.nodeId) {
      existingConnection.bindNode(connectionData.nodeId);
    }

    return existingConnection;
  }

  bindNode({ connectionId, nodeId }) {
    const connection = this.getById(connectionId);

    if (!connection) {
      return null;
    }

    return connection.bindNode(nodeId);
  }

  remove(connectionId) {
    const connection = this.getById(connectionId);

    if (!connection) {
      return null;
    }

    this.connections.delete(connectionId);
    return connection;
  }

  getById(connectionId) {
    return this.connections.get(connectionId) ?? null;
  }

  getByNodeId(nodeId) {
    return (
      Array.from(this.connections.values()).find(
        (connection) => connection.nodeId === nodeId,
      ) ?? null
    );
  }

  has(connectionId) {
    return this.connections.has(connectionId);
  }

  getAll() {
    return Array.from(this.connections.values());
  }

  // Compatibility aliases.
  // TODO: Remove these later after updating all call sites.
  addConnection({ connectionId }) {
    return this.add({ connectionId });
  }

  removeConnection(connectionId) {
    return this.remove(connectionId);
  }

  getConnection(connectionId) {
    return this.getById(connectionId);
  }

  findConnectionByNodeId(nodeId) {
    return this.getByNodeId(nodeId);
  }

  getAllConnections() {
    return this.getAll();
  }
}
