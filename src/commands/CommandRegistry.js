export class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  register(name, command) {
    this.commands.set(name, command);
  }

  get(name) {
    return this.commands.get(name);
  }

  has(name) {
    return this.commands.has(name);
  }

  getAll() {
    return Array.from(this.commands.keys());
  }
}
