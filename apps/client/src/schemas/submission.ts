import { Problem } from "./problem";
import { User } from "./user";

export type SubmissionStatus =
  | "SUBMITTED"
  | "JUDGING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "SERVER_ERROR";

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

  status: SubmissionStatus;

  createdAt: string;
}
