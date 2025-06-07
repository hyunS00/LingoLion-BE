import { Transform } from 'class-transformer';
import { BaseTimeEntity } from 'src/common/entities/baseTime.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import { PrimaryGeneratedColumn, ManyToOne, Column, Entity } from 'typeorm';

@Entity()
export class Feedback extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  detailedFeedback: Object;

  @Column()
  message: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.feedback, {
    nullable: false,
  })
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.feedback, { nullable: false })
  user: User;
}
