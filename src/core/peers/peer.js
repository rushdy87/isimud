import { PeerStatus } from './PeerStatus.js';

export class Peer {
  constructor({
    nodeId,
    username,
    address,
    tcpPort,
    status = PeerStatus.DISCOVERED,
    lastSeen = Date.now(),
  }) {
    if (!nodeId) {
      throw new Error('Peer requires nodeId');
    }

    this.nodeId = nodeId;
    this.username = username;
    this.address = address;
    this.tcpPort = tcpPort;
    this.status = status;
    this.lastSeen = lastSeen;
  }

  update(updates) {
    Object.assign(this, {
      ...updates,
      lastSeen: Date.now(),
    });
  }

  markConnected() {
    this.status = PeerStatus.CONNECTED;
    this.lastSeen = Date.now();
  }

  markDisconnected() {
    this.status = PeerStatus.DISCONNECTED;
    this.lastSeen = Date.now();
  }
}
