import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export class IdentityStore {
  constructor({ filePath = '.isimud/identity.json' } = {}) {
    this.filePath = filePath;
  }

  loadOrCreate({ username, tcpPort }) {
    const existingIdentity = this.#readIdentity();

    if (existingIdentity) {
      const updatedIdentity = {
        ...existingIdentity,
        username,
        tcpPort,
        updatedAt: new Date().toISOString(),
      };

      this.#writeIdentity(updatedIdentity);

      return updatedIdentity;
    }

    const newIdentity = {
      nodeId: randomUUID(),
      username,
      tcpPort,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.#writeIdentity(newIdentity);

    return newIdentity;
  }

  #readIdentity() {
    if (!fs.existsSync(this.filePath)) {
      return null;
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`Failed to read identity file: ${error.message}`);
    }
  }

  #writeIdentity(identity) {
    const dir = path.dirname(this.filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.filePath, JSON.stringify(identity, null, 2));
  }
}
