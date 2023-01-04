import { Problem } from "./problem";
import { User } from "./user";

export interface Submission {
  id: number;

  problemId: number;
  problem?: Problem;

  language: string;
  code: string;

  userId: number;
  user?: User;

  time: number;
  memory: number;

  status: string;

  createdAt: string;
}
