import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DockerModuleOptions } from './interfaces/docker-module-options.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DockerModuleOptions>().build();
