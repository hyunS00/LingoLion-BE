import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Situation } from './situation.entity';

@Entity()
export class Conversation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  icon: string;

  @OneToOne(() => Situation, (situation) => situation.conversation, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  situation: Situation;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
