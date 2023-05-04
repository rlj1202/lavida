import { DynamicModule, Module } from '@nestjs/common';

import { Judger } from './judger.service';
import { DockerModule } from '@lavida/docker';

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './judger.module-definition';

@Module({})
export class JudgerModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      module: JudgerModule,
      imports: [DockerModule.register(options)],
      providers: [Judger],
      controllers: [],
      exports: [Judger],
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const { providers, imports, controllers, exports } = super.registerAsync(
      options,
    );

    return {
      module: JudgerModule,
      imports: [
        ...(imports || []),
        DockerModule.registerAsync({
          imports: imports,
          useFactory: async (options: typeof OPTIONS_TYPE) => {
            return options;
          },
          inject: [MODULE_OPTIONS_TOKEN],
          provideInjectionTokensFrom: [...(providers || [])],
        }),
      ],
      controllers: [...(controllers || [])],
      providers: [...(providers || []), Judger],
      exports: [...(exports || []), Judger],
    };
  }
}
