import { Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';

import { SubmissionsService } from 'src/submissions/submissions.service';
import { ProblemsService } from 'src/problems/problems.service';

@Injectable()
export class JudgeService {
  private docker: Docker;

  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly problemsService: ProblemsService,
  ) {
    this.docker = new Docker();
  }

  async judge(submissionId: number) {
    const submission = await this.submissionsService.findById(submissionId);
    const problem = await this.problemsService.findById(submission.problemId);

    await this.docker
      .createContainer({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        OpenStdin: false,
        StdinOnce: false,
        Image: 'ubuntu',
        Cmd: ['/some/destination/someexecutable'],
        HostConfig: {
          // Runtime: 'runsc', // Later for gVisor
          AutoRemove: true,
          Ulimits: [
            {
              Name: 'cpu', // TODO: POSIX only allows for second precision in setrlimit.
              Soft: `${Math.ceil(problem.timeLimit / 1000)}`,
              Hard: `${Math.ceil(problem.timeLimit / 1000)}`,
            },
            {
              Name: 'as',
              Soft: `${problem.memoryLimit}`,
              Hard: `${problem.memoryLimit}`,
            },
          ],
          Memory: problem.memoryLimit, // Memory limit in bytes
          // MemorySwap: undefined,
          Mounts: [
            {
              Type: 'bind',
              Source: '/some/source',
              Target: '/some/destination',
              ReadOnly: true,
            },
          ],
        },
      })
      .then((container) => {
        return container.start();
      })
      .catch((err) => {
        // TODO:
        Logger.log(`${err}`);
      });

    return;
  }
}
