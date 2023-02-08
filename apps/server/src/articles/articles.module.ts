import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

import { Article } from './entities/article.entity';
import { Board } from 'src/boards/entities/board.entity';

import { ArticlesController } from './articles.controller';
import {
  CreateArticleHandler,
  DeleteArticleHandler,
  UpdateArticleHandler,
} from './articles.handler';
import { ArticlesService } from './articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Board]), CaslModule],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    CreateArticleHandler,
    UpdateArticleHandler,
    DeleteArticleHandler,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}
