import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from '@lavida/core/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), CaslModule],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
