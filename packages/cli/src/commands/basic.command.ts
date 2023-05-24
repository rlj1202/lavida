import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'The basic command' })
export class BasicCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParams, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParams, options.number);
    } else if (options?.string) {
      this.runWithString(passedParams, options.string);
    } else {
      this.runWithNone(passedParams);
    }
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string[], option: string): void {
    console.log(param, option);
    // this.logService.log({ param, string: option });
  }

  runWithNumber(param: string[], option: number): void {
    console.log(param, option);
    // this.logService.log({ param, number: option });
  }

  runWithBoolean(param: string[], option: boolean): void {
    console.log(param, option);
    // this.logService.log({ param, boolean: option });
  }

  runWithNone(param: string[]): void {
    console.log(param);
    // this.logService.log({ param });
  }
}
