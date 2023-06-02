export class TimeLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'TimeLimitExceededError';
  }
}
