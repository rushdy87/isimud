export class WhoamiCommand {
  constructor({ username, port }) {
    this.username = username;
    this.port = port;
  }

  execute() {
    console.log(`
You are:
  username: ${this.username}
  port: ${this.port}
`);
  }
}
