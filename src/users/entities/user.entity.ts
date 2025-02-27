import { Exclude, Transform } from 'class-transformer';
import { RefreshToken } from 'src/auth/entities/refresh.entity';
import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Situation } from 'src/situations/entities/situation.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  Admin,
  Common,
}

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    enum: Role,
    default: Role.Common,
    nullable: false,
  })
  @Transform(({ value }) => Role[value])
  role: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Situation, (situation) => situation.user)
  situations: Situation[];
}
