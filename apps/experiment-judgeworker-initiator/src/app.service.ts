import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Submission,
  SubmissionStatus,
} from '@lavida/core/entities/submission.entity';

import { languageProfiles } from '@lavida/core/language-profile/language-profiles';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  async updateSubmissionStatus(
    submissionId: number,
    status: SubmissionStatus,
  ): Promise<void> {
    await this.submissionsRepository.update(submissionId, {
      status,
    });
  }

  async doesNeedCompile(language: string): Promise<boolean> {
    const curLangProfile = languageProfiles[language];
    if (!curLangProfile) {
      throw new Error(`not supported language: ${language}`);
    }

    const needCompile = curLangProfile.compile ? true : false;

    return needCompile;
  }
}
