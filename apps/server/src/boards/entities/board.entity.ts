import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Article } from 'src/articles/entities/article.entity';

import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@SubjectClass()
export class Board {
  static readonly modelName = 'Board';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  /** Also used in url */
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'text' })
  title: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Article, (article) => article.board)
  articles: Article[];

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
