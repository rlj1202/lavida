import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { Article } from '@lavida/core/entities/article.entity';
import { Board } from '@lavida/core/entities/board.entity';

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
