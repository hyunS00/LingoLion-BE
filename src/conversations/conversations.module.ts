import { Module } from '@nestjs/common';
import { ConversationsService } from './services/conversations.service';
import { ConversationsController } from './controllers/conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { OpenAIService } from 'src/openAI/openAI.service';
import { Situation } from './entities/situation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Situation])],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAIService],
})
export class ConversationsModule {}
