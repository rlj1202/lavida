import { Module } from '@nestjs/common';

import { BasicCommand } from './basic.command';

@Module({
  imports: [],
  providers: [BasicCommand],
})
export class AppModule {}
