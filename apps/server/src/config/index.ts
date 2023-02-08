import { appConfigTuple } from './app.config';
import { databaseConfigTuple } from './database.config';
import { jwtConfigTuple } from './jwt.config';
import { judgeConfigTuple } from './judge.config';
import { dockerConfigTuple } from './docker.config';
import { mailerConfigTuple } from './mailer.config';

import { UnionToIntersection } from 'src/common/UnionToIntersection';
import { MergeIntersection } from 'src/common/MergeIntersection';

export type ConfigTuple = readonly [string, () => object];

const configTuples = [
  appConfigTuple,
  databaseConfigTuple,
  jwtConfigTuple,
  judgeConfigTuple,
  dockerConfigTuple,
  mailerConfigTuple,
] as const satisfies readonly ConfigTuple[];

export const configs = configTuples.map((tuple) => tuple[1]);

type ConfigTupleToRecord<T extends ConfigTuple> = {
  [K in keyof ReturnType<T[1]> as `${T[0]}.${K extends string
    ? K
    : never}`]: ReturnType<T[1]>[K];
};

type ConfigTuplesToRecord<T extends readonly [...ConfigTuple[]]> = {
  [K in keyof T]: ConfigTupleToRecord<T[K]>;
};

export type AppConfigType = MergeIntersection<
  UnionToIntersection<ConfigTuplesToRecord<typeof configTuples>[number]>
>;
