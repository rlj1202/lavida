import { User } from "./user";
import { WorkbookProblem } from "./workbookProblem";

export interface Workbook {
  id: number;
  title: string;
  description: string;
  author: User;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  workbookProblems: WorkbookProblem[];
}
