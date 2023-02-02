import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { BoardsController } from './boards.controller';
import { CreateBoardHandler, UpdateBoardHandler } from './boards.handler';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), CaslModule],
  controllers: [BoardsController],
  providers: [BoardsService, CreateBoardHandler, UpdateBoardHandler],
  exports: [BoardsService],
})
export class BoardsModule {}
