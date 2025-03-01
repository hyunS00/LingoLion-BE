import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AiModule } from 'src/ai/ai.module';
import { Situation } from 'src/situations/entities/situation.entity';
import { PromptModule } from 'src/ai/prompt/prompt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Situation]),
    AiModule,
    PromptModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
