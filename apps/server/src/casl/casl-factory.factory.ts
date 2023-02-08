import {
  AbilityBuilder,
  createMongoAbility,
  ForcedSubject,
  InferSubjects,
  MongoAbility,
  RawRuleFrom,
  SubjectClass,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Problem } from 'src/problems/entities/problem.entity';
import { Submission } from 'src/submissions/entities/submission.entity';
import { User } from 'src/users/entities/user.entity';
import { Workbook } from 'src/workbooks/entities/workbook.entity';
import { Contest } from 'src/contests/entities/contest.entity';
import { Board } from 'src/boards/entities/board.entity';
import { Article } from 'src/articles/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Role } from 'src/roles/entities/role.entity';

import { UnionToIntersection } from 'src/common/UnionToIntersection';
import { MergeIntersection } from 'src/common/MergeIntersection';

export const Action = {
  /** 'manage' is special keyword used in CASL. */
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;

export type Actions = typeof Action[keyof typeof Action];

type InferForcedSubjects<T> =
  | T
  | (T extends SubjectClass<infer Name extends string>
      ? ForcedSubject<Name>
      : never);

export const Subjects = [
  User,
  Submission,
  Problem,
  Workbook,
  Contest,
  Board,
  Article,
  Comment,
  Role,
  'all',
] as const;

export type Subjects = InferSubjects<
  InferForcedSubjects<typeof Subjects[number]>,
  true
>;

export type AppAbilities = [Actions, Subjects];
export type AppAbility = MongoAbility<AppAbilities>;

export type AppRawRule = RawRuleFrom<AppAbilities, object>;

type SelectProperties<T> = T[keyof T];

type JoinPath<
  A extends string = string,
  B extends string = string,
> = `${A}.${B}`;

type GetType<T, P extends string, Fail = never> = P extends JoinPath<
  infer K,
  infer R
>
  ? K extends keyof T
    ? GetType<T[K], R>
    : Fail
  : P extends keyof T
  ? T[P]
  : Fail;

type PathToObject<P extends string | number | symbol, T> = P extends JoinPath<
  infer Prop,
  infer R
>
  ? { [K in Prop]: PathToObject<R, T> }
  : { [K in P]: T };

type FlatTypeToObject<T> = {
  [K in Exclude<keyof T, JoinPath>]: T[K];
} & UnionToIntersection<
  SelectProperties<{
    [K in Extract<keyof T, JoinPath>]: PathToObject<K, T[K]>;
  }>
>;

type PathsToFlatType<T, Paths extends string> = {
  [K in Paths]: GetType<T, K>;
};

type ExpandFlatType<
  T extends FlatTypeToObject<FlatType>,
  Paths extends string = never,
  FlatType = PathsToFlatType<T, Paths>,
> = MergeIntersection<T & FlatType>;

@Injectable()
export class CaslAbilityFactory {
  createForAdmin(_user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can('manage', 'all');

    return build();
  }

  createForGuest(): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    can<Board>('read', 'Board');
    can<Article>('read', 'Article');
    can<Comment>('read', 'Comment');

    can<User>('read', 'User');

    can<Problem>('read', 'Problem');
    can<Workbook>('read', 'Workbook');
    can<Contest>('read', 'Contest');

    return build();
  }

  createForUser(user: User): AppAbility {
    const { can, cannot, rules } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // ...When providing subject type it was important to handle cases when
    // passed in argument is a string or function. As an alternative it was
    // possible to call built-in `detectSubjectType` which could catch this
    // cases...
    //
    // Also it's important to note that it's no longer possible to use classes
    // and strings as subject types interchangeably as it was before. Now, if
    // you want to use classes, you should use them everywhere and define custom
    // `detectSubjectType`.
    //
    // https://github.com/stalniy/casl/blob/master/packages/casl-ability/CHANGELOG.md

    can<User>('read', 'User');
    can<User>('update', 'User', { id: user.id });
    can<User>('delete', 'User', { id: user.id });

    can<Submission>('read', 'Submission', { userId: user.id });
    can<Submission>('create', 'Submission');
    cannot<Submission>('update', 'Submission').because(
      'You cannot update submission.',
    );
    cannot<Submission>('delete', 'Submission').because(
      'You cannot delete submission.',
    );

    can<Problem>('read', 'Problem');
    can<Problem>('update', 'Problem', { authorId: user.id });
    can<Problem>('update', 'Problem', { testers: { id: user.id } });

    can<Workbook>('read', 'Workbook');
    can<Workbook>('create', 'Workbook');
    can<Workbook>(
      'update',
      'Workbook',
      ['title', 'description', 'workbookProblems'],
      {
        authorId: user.id,
      },
    );
    can<Workbook>('delete', 'Workbook', { authorId: user.id });

    can<Article>('read', 'Article');
    can<ExpandFlatType<Article, 'board.name'>>('create', 'Article', {
      'board.name': 'free',
    });
    can<ExpandFlatType<Article, 'board.name'>>('create', 'Article', {
      'board.name': 'question',
    });
    can<ExpandFlatType<Article, 'board.name'>>('create', 'Article', {
      'board.name': 'ad',
    });
    can<Article>('update', 'Article', ['title', 'content'], {
      authorId: user.id,
    });
    can<Article>('delete', 'Article', { authorId: user.id });

    can<Comment>('read', 'Comment');
    can<Comment>('create', 'Comment');
    can<Comment>('update', 'Comment', ['content'], { authorId: user.id });
    can<Comment>('delete', 'Comment', { authorId: user.id });

    can<Contest>('read', 'Contest');
    can<Contest>(
      'update',
      'Contest',
      ['title', 'description', 'contestProblems', 'startAt', 'endAt'],
      { authorId: user.id },
    );
    can<Contest>('update', 'Contest', { testers: { id: user.id } });

    // Order matters because later one will override previous rules.
    const ability = createMongoAbility<AppAbility>([
      ...this.createForGuest().rules,
      ...rules,
      ...(!!user.role?.permissions ? user.role.permissions : []),
      ...(!!user.permissions ? user.permissions : []),
    ]);

    return ability;
  }
}
