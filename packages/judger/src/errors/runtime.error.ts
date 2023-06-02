export class RuntimeError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'RuntimeError';
  }
}
