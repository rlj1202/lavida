import { Problem } from "./problem";

export interface WorkbookProblem {
  workbookId: number;
  problemId: number;
  order: number;

  problem: Problem;
}
