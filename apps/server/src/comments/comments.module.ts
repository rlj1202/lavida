import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsControler } from './comments.controller';
import { CaslModule } from 'src/casl/casl.module';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { DeleteCommentHandler, UpdateCommentHandler } from './comments.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CaslModule],
  controllers: [CommentsControler],
  providers: [CommentsService, UpdateCommentHandler, DeleteCommentHandler],
  exports: [CommentsService],
})
export class CommentsModule {}
