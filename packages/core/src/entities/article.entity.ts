import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Comment } from '@lavida/core/entities/comment.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Board } from '@lavida/core/entities/board.entity';

import SubjectClass from '@lavida/core/decorators/subject-class.decorator';

@Entity()
@SubjectClass()
export class Article {
  static readonly modelName = 'Article';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Board)
  board: Board;

  @ApiProperty()
  @Column()
  boardId: number;

  @ManyToOne(() => User)
  author: User;

  @ApiProperty()
  @Column()
  authorId: number;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

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
