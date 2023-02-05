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

import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

import SubjectClass from 'src/casl/subject-class.decorator';
import { ApiProperty } from '@nestjs/swagger';

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

  @TreeParent()
  parent: Comment;

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
