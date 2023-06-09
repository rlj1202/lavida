import { Problem } from './problem';

export interface ContestProblem {
  contestId: number;
  problemId: number;
  order: number;

  problem: Problem;
}
