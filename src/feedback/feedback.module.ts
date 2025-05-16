import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmFeedbackRepository } from './repositories/typeorm-feedback.repository';
import { TypeOrmUserRepository } from 'src/users/repositories/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmConversationRepository } from 'src/conversations/repositories/typeorm-conversation.repository';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, User, Conversation])],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    { provide: 'IFeedbackRepository', useClass: TypeOrmFeedbackRepository },
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    {
      provide: 'IConversationRepository',
      useClass: TypeOrmConversationRepository,
    },
  ],
})
export class FeedbackModule {}
