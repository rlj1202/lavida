export class MemoryLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'MemoryLimitExceededError';
  }
}
