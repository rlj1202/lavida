import { DynamicModule, Module } from '@nestjs/common';
import Dockerode = require('dockerode');

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './docker.module-definition';

import { DockerService } from './docker.service';

@Module({})
export class DockerModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      module: DockerModule,
      providers: [
        {
          provide: Dockerode,
          useFactory: async () => {
            const docker = new Dockerode(options);

            return docker;
          },
        },
        DockerService,
      ],
      exports: [Dockerode, DockerService],
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const { providers } = super.registerAsync(options);

    return {
      module: DockerModule,
      providers: [
        ...(providers || []),
        {
          provide: Dockerode,
          useFactory: async (options: typeof OPTIONS_TYPE) => {
            const docker = new Dockerode(options);

            return docker;
          },
          inject: [MODULE_OPTIONS_TOKEN],
        },
        DockerService,
      ],
      exports: [Dockerode, DockerService],
    };
  }
}
