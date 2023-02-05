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

import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';

import SubjectClass from 'src/casl/subject-class.decorator';
import { ApiProperty } from '@nestjs/swagger';

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
