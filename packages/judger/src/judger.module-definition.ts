import { ConfigurableModuleBuilder } from '@nestjs/common';
import { JudgerModuleOptions } from './judger-module-options.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<JudgerModuleOptions>().build();
