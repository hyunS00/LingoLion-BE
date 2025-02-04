import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { BaseTable } from 'src/common/entities/base-table.entity';
import { Situation } from './situation.entity';

@Entity()
export class Conversation extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Situation, {
    nullable: false,
  })
  @JoinColumn()
  situation: Situation;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
