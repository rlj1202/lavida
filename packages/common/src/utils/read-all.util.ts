import { Stream } from 'stream';

export async function readAll(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (error) => reject(error));
    stream.on('close', () => resolve(Buffer.concat(chunks)));
    stream.on('finish', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}
