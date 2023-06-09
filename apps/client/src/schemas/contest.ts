import { ContestProblem } from './contestProblem';
import { User } from './user';

export interface Contest {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  author: User;
  authorId: number;
  admins: User[];
  testers: User[];
  participants: User[];
  contestProblems: ContestProblem[];
}
