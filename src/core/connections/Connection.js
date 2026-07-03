export class Connection {
  constructor({
    connectionId,
    nodeId = null,
    direction = 'unknown',
    connectedAt = new Date().toISOString(),
  }) {
    if (!connectionId) {
      throw new Error('Connection requires connectionId');
    }

    this.connectionId = connectionId;
    this.nodeId = nodeId;
    this.direction = direction;
    this.connectedAt = connectedAt;
  }

  bindNode(nodeId) {
    this.nodeId = nodeId;
    return this;
  }

  toJSON() {
    return {
      connectionId: this.connectionId,
      nodeId: this.nodeId,
      direction: this.direction,
      connectedAt: this.connectedAt,
    };
  }
}
/** Notes:
 * This class represents a connection between nodes in a network.
 * It includes information about the connection ID, the node ID it is
 * connected to, the direction of the connection, and the timestamp
 * when the connection was established.
 * What is direction? It indicates the flow of data or control
 * between nodes, which can be 'incoming', 'outgoing', or 'unknown'.
 * Why its 'unknown' by default? Because when a connection is
 * first created, the direction may not be determined yet,
 * so it defaults to 'unknown'.
 */
