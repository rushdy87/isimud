import { MessageFactory } from '../../core/messages/MessageFactory.js';

export class SendToCommand {
  constructor({ identity, transport, peerRegistry, connectionRegistry }) {
    this.identity = identity;
    this.transport = transport;
    this.peerRegistry = peerRegistry;
    this.connectionRegistry = connectionRegistry;
  }

  execute(args) {
    const [username, ...messageParts] = args;

    if (!username || messageParts.length === 0) {
      console.log('Usage: /send-to <username> <message>');
      return;
    }

    const peer = this.peerRegistry.findPeerByUsername(username);

    if (!peer) {
      console.log(`Peer not found: ${username}`);
      console.log('Use /peers to see known peers.');
      return;
    }

    if (peer.status !== 'connected') {
      console.log(`Peer ${peer.username} is not connected.`);
      console.log('Use /connect-peer <username> first.');
      return;
    }

    const connection = this.connectionRegistry.findConnectionByNodeId(
      peer.nodeId,
    );

    if (!connection) {
      console.log(`No active connection found for ${peer.username}.`);
      return;
    }

    const body = messageParts.join(' ');

    const message = MessageFactory.createChatMessage({
      identity: this.identity,
      body,
    });

    const sent = this.transport.sendToConnection(
      connection.connectionId,
      message,
    );

    if (!sent) {
      console.log(`Failed to send message to ${peer.username}.`);
      return;
    }

    console.log(`[me -> ${peer.username}]: ${body}`);
  }
}
