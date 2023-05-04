import { Test } from '@nestjs/testing';

import { DockerModule } from '@lavida/docker/docker.module';

import { CompileError, Judger, TimeLimitExceededError } from './judger.service';

describe('Judger', () => {
  let judger: Judger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DockerModule.register({})],
      providers: [Judger],
    }).compile();

    judger = moduleRef.get<Judger>(Judger);
  });

  test('Not supported language', async () => {
    await expect(
      judger.judge('bruh', '', '', 0, 0, async (value: any) => {
        value;
      }),
    ).rejects.toThrow(Error);
  });

  test('Judge must be failed', async () => {
    const sourceCode = `
    #include <stdio.h>

    int main() {
      int A, B;
      scanf("%d %d", &A, &B);

      printf("%d\\n", 999);

      return 0;
    }
    `;
    const testcaseDir = './data/testcases/1000';

    const result = await judger.judge(
      'C++11',
      sourceCode,
      testcaseDir,
      1000,
      256 * 1024 * 1024,
      async (value: any) => {
        value;
      },
    );

    expect(result.accepted).toBeFalsy();
  });

  test('Judge must be accepted', async () => {
    const sourceCode = `
    #include <stdio.h>

    int main() {
      int A, B;
      scanf("%d %d", &A, &B);

      printf("%d\\n", A + B);

      return 0;
    }
    `;
    const testcaseDir = './data/testcases/1000';

    const result = await judger.judge(
      'C++11',
      sourceCode,
      testcaseDir,
      1000,
      256 * 1024 * 1024,
      async (value: any) => {
        value;
      },
    );

    expect(result.accepted).toBeTruthy();
  });

  test('Compile error', async () => {
    await expect(
      judger.judge(
        'C++11',
        'aaaaaaaa',
        '',
        1000,
        256 * 1024 * 1024,
        async (value: any) => {
          value;
        },
      ),
    ).rejects.toThrow(CompileError);
  });

  test('Time limit', async () => {
    const sourceCode = `
    #include <stdio.h>

    int main() {
      int A, B;
      scanf("%d %d", &A, &B);

      while (true) {}

      return 0;
    }
    `;
    const testcaseDir = './data/testcases/1000';

    await expect(
      judger.judge(
        'C++11',
        sourceCode,
        testcaseDir,
        100,
        256 * 1024 * 1024,
        async (value: any) => {
          value;
        },
      ),
    ).rejects.toThrow(TimeLimitExceededError);
  });

  test.skip('Memory limit exceeed', async () => {
    // TODO: should be implemented
  });
});
