import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/user.decorator';

import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { User } from 'src/users/entities/user.entity';
import { Article } from './entities/article.entity';

import { ArticlesService } from './articles.service';

import { DeleteArticleHandler, UpdateArticleHandler } from './articles.handler';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: Article })
  @Get(':id')
  async findById(@Param('id') id: number) {
    const article = await this.articlesService.findById(id);

    return article;
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateArticleDto })
  @ApiOkResponse({ type: Article })
  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ) {
    const article = await this.articlesService.create(user, createArticleDto);

    return article;
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(UpdateArticleHandler)
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    await this.articlesService.update(id, updateArticleDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(DeleteArticleHandler)
  async delete(@Param('id') id: number) {
    await this.articlesService.delete(id);
  }
}
