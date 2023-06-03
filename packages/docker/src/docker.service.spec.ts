import { Test } from '@nestjs/testing';

import Dockerode = require('dockerode');

import { DockerModule } from './docker.module';
import { DockerService } from './docker.service';

import { readAll } from '@lavida/common/utils/read-all.util';

describe('Docker', () => {
  let docker: Dockerode;
  let dockerService: DockerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DockerModule.registerAsync({
          useFactory: async () => {
            return {};
          },
        }),
      ],
    }).compile();

    docker = moduleRef.get<Dockerode>(Dockerode);
    dockerService = moduleRef.get<DockerService>(DockerService);
  });

  it('should ping', async () => {
    await docker.ping();
  });

  it('should get the images', async () => {
    await docker.getImage('lavida-gcc').inspect();
    await docker.getImage('lavida-python3').inspect();
  });

  describe('Container', () => {
    let container: Dockerode.Container;

    beforeAll(async () => {
      container = await docker.createContainer({
        Tty: true,
        Image: 'lavida-gcc',
        Cmd: ['/bin/bash'],
      });
    });

    afterAll(async () => {
      await container.stop({ t: 0 });
      await container.wait();
      await container.remove();
    });

    it('should start', async () => {
      await container.start();
      const info = await container.inspect();

      expect(info.State.Running).toBeTruthy();
    });

    it('should get the cwd', async () => {
      await container
        .exec({
          AttachStdout: true,
          WorkingDir: '/',
          Cmd: ['pwd'],
        })
        .then((exec) => exec.start({}))
        .then(async (duplex) => {
          const { stdoutStream } = await dockerService.demux(duplex);
          const output = (await readAll(stdoutStream)).toString('utf-8');

          expect(output.trim()).toEqual('/');
        });
    });

    it('should execute a command', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['echo', 'test'],
      });

      expect(result.stdoutOutput.trim()).toEqual('test');
      expect(result.stderrOutput.trim()).toEqual('');
    });

    it('should execute with the input', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['cat'],
        input: 'test',
      });

      expect(result.stdoutOutput.trim()).toEqual('test');
      expect(result.stderrOutput.trim()).toEqual('');
    });

    it('should execute with a time limit', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['cat'],
        timeLimit: 10,
      });

      expect(result.exitCode).toBe(124);
    });

    it('should execute with a memory limit', async () => {
      const megabytes = 10;
      const bytes = megabytes * 1024 * 1024;

      await container.update({
        Memory: bytes,
        MemorySwap: bytes,
      });

      const result = await dockerService.execute(container, {
        cmd: ['dd', 'bs=250M', 'if=/dev/zero', 'of=/dev/null'],
      });

      expect(result.exitCode).toBe(137);

      await container.update({
        Memory: 0,
        MemorySwap: 0,
      });
    });

    it('should copy a file', async () => {
      const filename = 'filename';
      const filecontent = 'content';

      await dockerService.putFile(container, filename, filecontent, './');

      await container
        .exec({
          AttachStdout: true,
          Cmd: ['cat', filename],
        })
        .then((exec) => exec.start({}))
        .then(async (duplex) => {
          const { stdoutStream } = await dockerService.demux(duplex);
          const output = (await readAll(stdoutStream)).toString('utf-8');

          expect(output).toEqual(filecontent);
        });
    });

    it('should get a file', async () => {
      const filepath = '/filename';

      const buffer = await dockerService.getFile(container, filepath);

      expect(buffer.toString()).toBe('content');
    });
  });
});
