export class CompileError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'CompileError';
  }
}
