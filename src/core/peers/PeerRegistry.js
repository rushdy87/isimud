export class PeerRegistry {
  constructor() {
    this.peers = new Map();
  }

  addPeer({
    peerId,
    username = 'unknown',
    host = null,
    port = null,
    status = 'connected',
  }) {
    const peer = {
      peerId,
      username,
      host,
      port,
      status,
      connectedAt: status === 'connected' ? new Date().toISOString() : null,
      discoveredAt: status === 'discovered' ? new Date().toISOString() : null,
    };

    this.peers.set(peerId, peer);

    return peer;
  }

  removePeer(peerId) {
    const peer = this.peers.get(peerId);

    if (!peer) {
      return null;
    }

    this.peers.delete(peerId);

    return peer;
  }

  updatePeer(peerId, updates) {
    const peer = this.peers.get(peerId);

    if (!peer) {
      return null;
    }

    const updatedPeer = {
      ...peer,
      ...updates,
    };

    this.peers.set(peerId, updatedPeer);

    return updatedPeer;
  }

  getPeer(peerId) {
    return this.peers.get(peerId) || null;
  }

  getAllPeers() {
    return Array.from(this.peers.values());
  }

  count() {
    return this.peers.size;
  }
}
