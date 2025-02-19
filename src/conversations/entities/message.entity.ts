import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';

export enum Sender {
  system = 'system',
  assistant = 'assistant',
  user = 'user',
}
@Entity()
export class Message extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: Sender.user,
  })
  sender: Sender;

  @Column()
  content: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    cascade: true,
    nullable: false,
  })
  conversation: Conversation;
}
