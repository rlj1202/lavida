import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Duplex, PassThrough, Readable, Writable } from 'stream';
import { IncomingMessage } from 'http';
import Dockerode = require('dockerode');
import DockerModem = require('docker-modem');
import tar = require('tar-stream');
import concat from 'concat-stream';

import { readAll } from '@lavida/common/utils/read-all.util';

@Injectable()
export class DockerService implements OnModuleInit {
  private readonly logger = new Logger(DockerService.name);

  constructor(private readonly dockerode: Dockerode) {}

  async onModuleInit() {
    await this.dockerode.ping();

    this.logger.verbose('Docker ping successful');
  }

  async demux(stream: Duplex): Promise<{
    stdinStream: Writable;
    stdoutStream: Readable;
    stderrStream: Readable;
  }> {
    const stdoutStream = new PassThrough();
    const stderrStream = new PassThrough();

    stream.on('error', (error) => {
      stdoutStream.destroy(error);
      stderrStream.destroy(error);
    });
    stream.on('end', () => {
      stdoutStream.end();
      stderrStream.end();
    });
    stream.on('close', () => {
      stdoutStream.end();
      stderrStream.end();
    });

    DockerModem.prototype.demuxStream(stream, stdoutStream, stderrStream);

    return {
      stdinStream: stream,
      stdoutStream: stdoutStream,
      stderrStream: stderrStream,
    };
  }

  async putFile(
    container: Dockerode.Container,
    filename: string,
    content: string | Buffer,
    dir: string,
  ) {
    const pack = tar.pack();
    pack.entry({ name: filename }, content);
    pack.finalize();

    // TODO: behavior will be changed on next version. (might be in 3.3.6)
    (
      (await container.putArchive(pack, {
        path: dir,
      })) as any as IncomingMessage
    ).destroy();
  }

  async getFile(
    container: Dockerode.Container,
    filepath: string,
  ): Promise<Buffer> {
    const fileTar = await container.getArchive({ path: filepath });

    const extract = tar.extract();

    const bufferPromise = new Promise<Buffer>((resolve, reject) => {
      let result: Buffer;

      extract.on('entry', (_header, stream, next) => {
        stream.on('error', (e) => {
          reject(e);
        });
        stream.pipe(
          concat((buffer) => {
            result = buffer;

            next();
          }),
        );
      });
      extract.on('finish', () => {
        resolve(result);
      });
    });

    fileTar.pipe(extract);

    const buffer = await bufferPromise;

    return buffer;
  }

  async execute(
    container: Dockerode.Container,
    options: { cmd: string[]; input?: string; timeLimit?: number },
  ) {
    const execCreateOptions: Dockerode.ExecCreateOptions = {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
    };

    let cmd = [...options.cmd];

    if (options.timeLimit) {
      cmd = ['timeout', `${options.timeLimit / 1000}`, ...cmd];
    }

    execCreateOptions.Cmd = cmd;

    if (options.input) {
      execCreateOptions.AttachStdin = true;
    }

    const exec = await container.exec(execCreateOptions);

    const execStartOptions: Dockerode.ExecStartOptions = {};

    if (options.input) {
      execStartOptions.hijack = true;
    }

    const duplex = await exec.start(execStartOptions);

    const { stdinStream, stdoutStream, stderrStream } = await this.demux(
      duplex,
    );

    if (options.input) {
      stdinStream.write(options.input);
      stdinStream.end();
    }

    const stdoutOutput = (await readAll(stdoutStream)).toString('utf-8');
    const stderrOutput = (await readAll(stderrStream)).toString('utf-8');

    const execInfo = await exec.inspect();
    const exitCode = execInfo.ExitCode;

    return {
      stdoutOutput,
      stderrOutput,
      exitCode,
    };
  }
}
