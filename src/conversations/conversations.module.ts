import { Module } from '@nestjs/common';
import { ConversationsService } from './services/conversations.service';
import { ConversationsController } from './controllers/conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AiModule } from 'src/ai/ai.module';
import { Situation } from 'src/situations/entities/situation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Situation]),
    AiModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
