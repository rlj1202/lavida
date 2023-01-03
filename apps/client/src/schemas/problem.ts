export interface Problem {
  id: number;

  title: string;
  description: string;
  inputDesc: string;
  outputDesc: string;
  hint?: string;

  timeLimit: number;
  memoryLimit: number;

  createdAt: string;
  updatedAt: string;
}
