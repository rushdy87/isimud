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
      port: Number(process.env.ISIMUD_DISCOVERY_PORT) || tcpPort + 50000,
      targetPorts: (
        process.env.ISIMUD_DISCOVERY_TARGET_PORTS || '55000,55001,55002'
      )
        .split(',')
        .map(Number),
      broadcastAddress:
        process.env.ISIMUD_BROADCAST_ADDRESS || '255.255.255.255',
      announceIntervalMs:
        Number(process.env.ISIMUD_ANNOUNCE_INTERVAL_MS) || 5000,
    },
  };
}
