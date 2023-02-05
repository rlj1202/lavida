import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AppRawRule } from 'src/casl/casl-factory.factory';
import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@Tree('closure-table')
@SubjectClass()
export class Role {
  static readonly modelName = 'Role';

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @Column({ type: 'json' })
  permissions: AppRawRule[];

  @TreeParent()
  parent: Role;

  @TreeChildren()
  children: Role[];
}
