import { PeerStatus } from './PeerStatus.js';

export class Peer {
  constructor({
    nodeId,
    username,
    host,
    address,
    tcpPort,
    status = PeerStatus.DISCOVERED,
    discoveredAt = null,
    connectedAt = null,
    disconnectedAt = null,
    lastSeen = Date.now(),
  }) {
    if (!nodeId) {
      throw new Error('Peer requires nodeId');
    }

    this.nodeId = nodeId;
    this.username = username;
    this.host = host ?? address;
    this.tcpPort = tcpPort;
    this.status = status;
    this.discoveredAt = discoveredAt;
    this.connectedAt = connectedAt;
    this.disconnectedAt = disconnectedAt;
    this.lastSeen = lastSeen;
  }

  update(updates) {
    const normalizedUpdates = {
      ...updates,
      host: updates.host ?? updates.address ?? this.host,
      lastSeen: Date.now(),
    };

    delete normalizedUpdates.address;

    Object.assign(this, normalizedUpdates);
  }

  markConnected() {
    this.status = PeerStatus.CONNECTED;
    this.connectedAt = new Date().toISOString();
    this.lastSeen = Date.now();
  }

  markDisconnected() {
    this.status = PeerStatus.DISCONNECTED;
    this.disconnectedAt = new Date().toISOString();
    this.lastSeen = Date.now();
  }
}
