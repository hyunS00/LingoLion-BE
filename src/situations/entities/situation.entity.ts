import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Conversation, (conversation) => conversation.situation)
  conversation: Conversation;
}
