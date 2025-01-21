import { Module } from '@nestjs/common';
import { ConversationsService } from './services/conversations.service';
import { ConversationsController } from './controllers/conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { OpenAiService } from 'src/openAi/openAi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message])],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAiService],
})
export class ConversationsModule {}
