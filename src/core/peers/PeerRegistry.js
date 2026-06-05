export class PeerRegistry {
  constructor() {
    this.peers = new Map();
  }

  addPeer({
    nodeId,
    username = 'unknown',
    host = null,
    port = null,
    status = 'connected',
  }) {
    const peer = {
      nodeId,
      username,
      host,
      port,
      status,
      connectedAt: status === 'connected' ? new Date().toISOString() : null,
      discoveredAt: status === 'discovered' ? new Date().toISOString() : null,
    };

    this.peers.set(nodeId, peer);

    return peer;
  }

  removePeer(nodeId) {
    const peer = this.peers.get(nodeId);

    if (!peer) return null;

    this.peers.delete(nodeId);
    return peer;
  }

  updatePeer(nodeId, updates) {
    const peer = this.peers.get(nodeId);

    if (!peer) return null;

    const updatedPeer = {
      ...peer,
      ...updates,
    };

    this.peers.set(nodeId, updatedPeer);

    return updatedPeer;
  }

  getPeer(nodeId) {
    return this.peers.get(nodeId) || null;
  }

  findPeerByUsername(username) {
    const normalizedUsername = username.toLowerCase();

    return (
      this.getAllPeers().find(
        (peer) => peer.username.toLowerCase() === normalizedUsername,
      ) || null
    );
  }

  getAllPeers() {
    return Array.from(this.peers.values());
  }

  count() {
    return this.peers.size;
  }
}
