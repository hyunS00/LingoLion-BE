import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Situation } from 'src/situations/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Conversation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  icon: string;

  @ManyToOne(() => Situation, (situation) => situation.conversations, {
    nullable: false,
  })
  situation: Situation;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @ManyToOne(() => User, (user) => user.conversations, { nullable: false })
  user: User;
}
