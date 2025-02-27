import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SituationType {
  'Place' = 'place',
  'AiRole' = 'aiRole',
  'UserRole' = 'userRole',
  'Goal' = 'goal',
}

@Entity()
export class Situation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  place: string;

  @Column()
  aiRole: string;

  @Column()
  userRole: string;

  @Column()
  goal: string;

  @OneToMany(() => Conversation, (conversation) => conversation.situation)
  conversations: Conversation[];

  @ManyToOne(() => User, (user) => user.situations)
  user: User;
}
