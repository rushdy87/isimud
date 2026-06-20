import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export class IdentityStore {
  constructor({ filePath = '.isimud/identity.json' } = {}) {
    this.filePath = filePath;
  }

  loadOrCreate({ username, tcpPort }) {
    const identity = this.#readIdentity();

    if (identity) {
      return {
        ...identity,
        username,
        tcpPort,
      };
    }

    const newIdentity = {
      nodeId: randomUUID(),
      username,
      tcpPort,
      createdAt: new Date().toISOString(),
    };

    this.#writeIdentity(newIdentity);

    return newIdentity;
  }

  #readIdentity() {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }

    const raw = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(raw);
  }

  #writeIdentity(identity) {
    const dir = path.dirname(this.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.filePath, JSON.stringify(identity, null, 2));
  }
}
