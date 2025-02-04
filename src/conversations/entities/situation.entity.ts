import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class Situation {
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

  @OneToOne(() => Conversation, (conversation) => conversation.situation)
  conversation: Conversation;
}
