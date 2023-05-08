import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { User } from '@lavida/core/entities/user.entity';

export class UserInfoDto extends User {
  @ApiProperty({ type: UserProblem, isArray: true })
  @IsArray()
  problems: UserProblem[];
}
