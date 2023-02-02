import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

import { AppRawRule } from 'src/casl/casl-factory.factory';
import SubjectClass from 'src/casl/subject-class.decorator';

@Entity()
@Tree('closure-table')
@SubjectClass()
export class Role {
  static readonly modelName = 'Role';

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'json' })
  permissions: AppRawRule[];

  @TreeParent()
  parent: Role;

  @TreeChildren()
  children: Role[];
}
