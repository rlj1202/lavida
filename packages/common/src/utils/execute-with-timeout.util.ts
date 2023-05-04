export async function executeWithTimeout<T>(
  prom: PromiseLike<T>,
  ms: number,
  err?: Error,
): Promise<T> {
  let timer: NodeJS.Timeout;
  return Promise.race([
    prom,
    new Promise<T>((_res, rej) => (timer = setTimeout(rej, ms, err))),
  ]).finally(() => clearTimeout(timer));
}
