import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { BaseTable } from 'src/common/entities/base-table.entity';

export enum Sender {
  system = 'system',
  ai = 'ai',
  user = 'user',
}
@Entity()
export class Message extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: Sender.user,
  })
  sender: Sender;

  @Column()
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    cascade: true,
    nullable: false,
  })
  chat: Chat;
}
