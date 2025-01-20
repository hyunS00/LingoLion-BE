import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { BaseTable } from 'src/common/entities/base-table.entity';

export enum Sender {
  user,
  ai,
  manager,
}
@Entity()
export class Message extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: Sender;

  @Column()
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.id, {
    cascade: true,
    nullable: false,
  })
  chat: Chat;
}
