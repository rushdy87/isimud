export class ConnectPeerCommand {
  constructor({ transport, peerRegistry }) {
    this.transport = transport;
    this.peerRegistry = peerRegistry;
  }

  execute(args) {
    const [username] = args;

    if (!username) {
      console.log('Usage: /connect-peer <username>');
      return;
    }

    const peer = this.peerRegistry.getByUsername(username);

    if (!peer) {
      console.log(`Peer not found: ${username}`);
      console.log('Use /peers to see discovered peers.');
      return;
    }

    if (!peer.address || !peer.tcpPort) {
      console.log(`Peer ${username} has no address or port info.`);
      return;
    }

    if (peer.status === 'connected') {
      console.log(`Already connected to ${peer.username}.`);
      return;
    }

    this.transport.connect(peer.address, peer.tcpPort);
  }
}
