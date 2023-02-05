import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { UserProblem } from 'src/userProblems/user-problem.entity';
import { User } from '../entities/user.entity';

@ApiExtraModels(UserProblem)
export class UserInfoDto extends User {
  @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(UserProblem) } })
  @IsArray()
  problems: UserProblem[];
}
