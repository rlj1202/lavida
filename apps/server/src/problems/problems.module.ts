import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Problem } from './entities/problem.entity';
import { ProblemsService } from './problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  controllers: [],
  providers: [ProblemsService],
  exports: [ProblemsService],
})
export class ProblemsModule {}
