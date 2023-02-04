import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from 'src/users/entities/user.entity';

@Entity()
export class RefreshToken {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  @Exclude()
  userId: number;

  @Column('varchar', { length: 255, unique: true, nullable: true })
  token?: string | null;

  @Column({ nullable: false })
  expiresAt: Date;
}
