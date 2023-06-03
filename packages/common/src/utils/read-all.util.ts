import { Readable } from 'node:stream';

import concat from 'concat-stream';

export async function readAll(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('error', reject);
    stream.pipe(
      concat(function (data) {
        resolve(data);
      }),
    );
  });
}
