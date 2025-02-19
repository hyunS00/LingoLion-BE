import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255, nullable: false })
  hashedSecret: string;

  @Column()
  isRevoked: boolean;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' })
  user: User;
}
