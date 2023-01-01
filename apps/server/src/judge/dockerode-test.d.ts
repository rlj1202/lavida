import 'dockerode';

declare module 'dockerode' {
  interface ContainerAttachOptions {
    detachKeys?: string | undefined;
    hijack?: boolean | undefined;
    logs?: boolean | undefined;
    stream?: boolean | undefined;
    stdin?: boolean | undefined;
    stdout?: boolean | undefined;
    stderr?: boolean | undefined;
    abortSignal?: AbortSignal;
  }

  interface ContainerStopOptions {
    /** Number of seconds to wait before killing the container */
    t?: number;
  }

  interface Container {
    attach(options: ContainerAttachOptions): Promise<NodeJS.ReadWriteStream>;

    stop(options: ContainerStopOptions, callback: Callback<any>): void;
    stop(options?: ContainerStopOptions): Promise<any>;
  }

  interface HostConfig {
    Ulimits?: { Name: string; Soft: number; Hard: number }[];
  }
}
