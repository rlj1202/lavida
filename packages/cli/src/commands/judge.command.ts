import path from 'path';
import fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Command, CommandRunner, Option } from 'nest-commander';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';

import { Problem } from '@lavida/core/entities/problem.entity';
import { JudgeRequestDto } from '@lavida/core/dtos/judge-request.dto';

import { KAFKA_CLIENT_TOKEN } from '../app.constants';

interface JudgeCommandOptions {
  submissionId?: number;

  language?: string;
  codePath?: string;

  problemId?: number;
  timeLimit?: number;
  memoryLimit?: number;
}

const JUDGE_TOPIC = 'judge';

@Command({ name: 'judge' })
export class JudgeCommand extends CommandRunner implements OnModuleInit {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly clientProxy: ClientKafka,
  ) {
    super();
  }

  async onModuleInit() {
    this.clientProxy.subscribeToResponseOf(JUDGE_TOPIC);
  }

  async run(
    passedParams: string[],
    options?: JudgeCommandOptions,
  ): Promise<void> {
    if (options?.submissionId !== undefined) {
      // TODO:
      const cnt = await this.problemsRepository.count({ where: {} });
      console.log(cnt);
    } else if (
      options?.language !== undefined &&
      options?.codePath !== undefined &&
      options?.problemId !== undefined
    ) {
      console.log(options);

      const code = fs
        .readFileSync(path.resolve(process.cwd(), options.codePath))
        .toString();

      const dto: JudgeRequestDto = {
        language: options.language,
        code: code,
        problemId: options.problemId,
      };

      const source = this.clientProxy.send(JUDGE_TOPIC, dto);
      const result = await lastValueFrom(source);

      console.log(result);
    }

    await this.clientProxy.close();
  }

  @Option({
    flags: '--submissionId <id>',
    description: '',
  })
  parseSubmissionId(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--problemId <id>',
    description: '',
  })
  parseProblemId(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--language <language>',
    description: '',
  })
  parseLanguage(val: string): string {
    return val;
  }

  @Option({
    flags: '--codePath <path>',
  })
  parseCodePath(val: string): string {
    return val;
  }

  @Option({
    flags: '--timeLimit <milli>',
  })
  parseTimeLimit(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--memoryLimit <bytes>',
  })
  parseMemoryLimit(val: string): number {
    return Number(val);
  }
}
