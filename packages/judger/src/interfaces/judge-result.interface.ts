export interface JudgeResult {
  accepted: boolean;

  /** In milli seconds */
  time: number;

  /** In bytes */
  memory: number;
}
