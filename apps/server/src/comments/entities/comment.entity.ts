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

@Entity()
@Tree('closure-table')
@SubjectClass()
export class Comment {
  static readonly modelName = 'Comment';

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorId: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Article)
  article: Article;

  @TreeParent()
  parent: Comment;

  @TreeChildren()
  children: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
