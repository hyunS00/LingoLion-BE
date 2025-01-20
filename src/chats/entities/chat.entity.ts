import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';
import { BaseTable } from 'src/common/entities/base-table.entity';

@Entity()
export class Chat extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (message) => message.id)
  messeages: Message[];
}
