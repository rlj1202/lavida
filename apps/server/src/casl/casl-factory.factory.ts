import {
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  MongoAbility,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Problem } from 'src/problems/entities/problem.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User | typeof Submission | typeof Problem>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );

    can(Action.Update, User, { id: user.id });
    can(Action.Delete, User, { id: user.id });

    can(Action.Create, Submission);
    cannot(Action.Update, Submission);
    cannot(Action.Delete, Submission);

    return build();
  }
}
