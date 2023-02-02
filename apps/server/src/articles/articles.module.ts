import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { ArticlesController } from './articles.controller';
import { DeleteArticleHandler, UpdateArticleHandler } from './articles.handler';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), CaslModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, UpdateArticleHandler, DeleteArticleHandler],
  exports: [ArticlesService],
})
export class ArticlesModule {}
