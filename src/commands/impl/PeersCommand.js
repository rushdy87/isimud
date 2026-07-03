export class PeersCommand {
  constructor({ peerRegistry }) {
    this.peerRegistry = peerRegistry;
  }

  execute() {
    const peers = this.peerRegistry.getAll();

    if (peers.length === 0) {
      console.log('No connected peers.');
      return;
    }

    console.log('\nConnected peers:');

    for (const peer of peers) {
      console.log(
        `- ${peer.username} | ${peer.address}:${peer.tcpPort} | nodeId: ${peer.nodeId} | status: ${peer.status} | connectedAt: ${peer.connectedAt}`,
      );
    }
  }
}
