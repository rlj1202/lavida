import { IsArray } from 'class-validator';

import { UserProblem } from 'src/userProblems/user-problem.entity';
import { User } from '../entities/user.entity';

export class UserInfoDTO extends User {
  @IsArray()
  problems: UserProblem[];
}
