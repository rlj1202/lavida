import { appConfigTuple } from './app.config';
import { databaseConfigTuple } from './database.config';
import { jwtConfigTuple } from './jwt.config';
import { judgeConfigTuple } from './judge.config';
import { dockerConfigTuple } from './docker.config';

export type ConfigTuple = readonly [string, () => object];

const configTuples = [
  appConfigTuple,
  databaseConfigTuple,
  jwtConfigTuple,
  judgeConfigTuple,
  dockerConfigTuple,
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

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type Merge<T> = { [K in keyof T]: T[K] };

export type AppConfigType = Merge<
  UnionToIntersection<ConfigTuplesToRecord<typeof configTuples>[number]>
>;
