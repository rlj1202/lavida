export interface Problem {
  id: number;

  title: string;
  description: string;
  inputDesc: string;
  outputDesc: string;
  samples?: { input: string; output: string }[];
  hint?: string;

  submissionCount: number;
  acceptCount: number;

  source?: string;

  timeLimit: number;
  memoryLimit: number;

  createdAt: string;
  updatedAt: string;
}
