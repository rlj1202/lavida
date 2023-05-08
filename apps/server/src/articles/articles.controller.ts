import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { EntityNotFoundError } from 'typeorm';

import { GetUser } from '@lavida/server/auth/user.decorator';

import { User } from '@lavida/core/entities/user.entity';
import { Article } from '@lavida/core/entities/article.entity';

import { ArticlesService } from './articles.service';

import {
  CreateArticleHandler,
  DeleteArticleHandler,
  UpdateArticleHandler,
} from './articles.handler';

import {
  UseAuthPolicies,
  UsePolicies,
} from '@lavida/server/decorators/use-policies.decorator';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginationResponseDto } from '@lavida/server/pagination/pagination-response.dto';
import { ListArticlesOptionsDto } from './dto/list-articles-options.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: Article })
  @Get(':id')
  @UsePolicies([async (ability) => ability.can('read', 'Article'), []])
  async findById(@Param('id') id: number) {
    try {
      const article = await this.articlesService.findById(id);

      return article;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Article) },
            },
          },
        },
      ],
    },
  })
  @Get()
  @UsePolicies([async (ability) => ability.can('read', 'Article'), []])
  async findAll(@Query() options: ListArticlesOptionsDto) {
    const articles = await this.articlesService.paginate(options);

    return articles;
  }

  @ApiBody({ type: CreateArticleDto })
  @ApiOkResponse({ type: Article })
  @Post()
  @UseAuthPolicies(CreateArticleHandler)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.create(user, createArticleDto);

    return article;
  }

  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  @UseAuthPolicies(UpdateArticleHandler)
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    await this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @UseAuthPolicies(DeleteArticleHandler)
  async delete(@Param('id') id: number) {
    await this.articlesService.delete(id);
  }
}
