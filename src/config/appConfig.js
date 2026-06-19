export function createAppConfig(argv = process.argv) {
  const username = argv[2] || 'anonymous';
  const tcpPort = Number(argv[3]) || 4000;

  return {
    identity: {
      username,
      tcpPort,
    },

    network: {
      tcpPort,
    },

    discovery: {
      port: Number(process.env.ISIMUD_DISCOVERY_PORT) || 55555,
      broadcastAddress:
        process.env.ISIMUD_BROADCAST_ADDRESS || '255.255.255.255',
      announceIntervalMs:
        Number(process.env.ISIMUD_ANNOUNCE_INTERVAL_MS) || 5000,
    },
  };
}
