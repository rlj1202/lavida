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

  test('Ping', async () => {
    await docker.ping();
  });

  test('Images', async () => {
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

    test('Start', async () => {
      await container.start();
      const info = await container.inspect();

      expect(info.State.Running).toBeTruthy();
    });

    test('Cwd', async () => {
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

    test('Execute', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['echo', 'test'],
      });

      expect(result.stdoutOutput.trim()).toEqual('test');
      expect(result.stderrOutput.trim()).toEqual('');
    });

    test('Execute with input', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['cat'],
        input: 'test',
      });

      expect(result.stdoutOutput.trim()).toEqual('test');
      expect(result.stderrOutput.trim()).toEqual('');
    });

    test('Execute with time limit', async () => {
      const result = await dockerService.execute(container, {
        cmd: ['cat'],
        timeLimit: 10,
      });

      expect(result.exitCode).toBe(124);
    });

    test('Copy file', async () => {
      const filename = 'filename';
      const filecontent = 'content';

      dockerService.putFile(container, filename, filecontent, './');

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
  });
});
