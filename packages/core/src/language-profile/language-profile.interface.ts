export interface LanguageProfile {
  /** Docker image name */
  image: string;
  /** Name of source code file */
  filename: string;
  /** Command line for compilation */
  compile?: string;
  /** Command line for execution */
  execution: string;
}
