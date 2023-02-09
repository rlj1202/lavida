import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { UserProblem } from 'src/userProblems/user-problem.entity';
import { User } from '../entities/user.entity';

export class UserInfoDto extends User {
  @ApiProperty({ type: UserProblem, isArray: true })
  @IsArray()
  problems: UserProblem[];
}
