import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@Tree('closure-table')
@SubjectClass()
export class Comment {
  static readonly modelName = 'Comment';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @ApiProperty()
  @Column()
  authorId: number;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Article)
  article: Article;

  @ApiProperty()
  @Column()
  articleId: number;

  @TreeParent()
  parent: Comment;

  @Column()
  parentId?: number;

  @TreeChildren()
  children: Comment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
