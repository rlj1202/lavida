import {
  AbilityBuilder,
  createMongoAbility,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Problem } from 'src/problems/entities/problem.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import { Workbook } from 'src/workbooks/entities/workbook.entity';
import { Contest } from 'src/contests/entities/contest.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<
      | typeof User
      | typeof Submission
      | typeof Problem
      | typeof Workbook
      | typeof Contest
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // TODO:
    const isAdmin = false;
    if (isAdmin) {
      can(Action.Manage, 'all');
    }

    can(Action.Update, User, { id: user.id });
    can(Action.Delete, User, { id: user.id });

    can(Action.Create, Submission);
    cannot(Action.Update, Submission);
    cannot(Action.Delete, Submission);

    can(Action.Update, Workbook, { authorId: user.id });
    can(Action.Delete, Workbook, { authorId: user.id });

    return build();
  }
}
