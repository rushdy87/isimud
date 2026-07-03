import { Peer } from './Peer.js';
import { PeerStatus } from './PeerStatus.js';

export class PeerRegistry {
  constructor() {
    this.peers = new Map();
  }

  add(peerData) {
    const peer = peerData instanceof Peer ? peerData : new Peer(peerData);

    this.peers.set(peer.nodeId, peer);

    return peer;
  }

  upsertPeer(peerData) {
    const existingPeer = this.getById(peerData.nodeId);

    if (!existingPeer) {
      return this.add(peerData);
    }

    return this.update(peerData.nodeId, peerData);
  }

  update(nodeId, updates) {
    const peer = this.getById(nodeId);

    if (!peer) {
      return null;
    }

    peer.update(updates);
    return peer;
  }

  remove(nodeId) {
    return this.peers.delete(nodeId);
  }

  has(nodeId) {
    return this.peers.has(nodeId);
  }

  getById(nodeId) {
    return this.peers.get(nodeId) ?? null;
  }

  getByUsername(username) {
    return (
      Array.from(this.peers.values()).find(
        (peer) => peer.username === username,
      ) ?? null
    );
  }

  getAll() {
    return Array.from(this.peers.values());
  }

  getConnected() {
    return this.getAll().filter((peer) => peer.status === PeerStatus.CONNECTED);
  }

  markConnected(nodeId) {
    const peer = this.getById(nodeId);

    if (!peer) {
      return null;
    }

    peer.markConnected();
    return peer;
  }

  markDisconnected(nodeId) {
    const peer = this.getById(nodeId);

    if (!peer) {
      return null;
    }

    peer.markDisconnected();
    return peer;
  }
}
