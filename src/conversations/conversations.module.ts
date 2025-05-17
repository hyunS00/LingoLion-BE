import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { AiModule } from 'src/ai/ai.module';
import { Situation } from 'src/situations/entities/situation.entity';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { TypeOrmConversationRepository } from './repositories/typeorm-conversation.repository';
import { TypeOrmMessageRepository } from './repositories/typeorm-message.repository';
import { TypeOrmSituationRepository } from 'src/situations/repositories/typeorm-situation.repository';
import { AgentModule } from 'src/agent/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, Situation]),
    AiModule,
    PromptModule,
    AgentModule,
  ],
  controllers: [ConversationsController],
  providers: [
    {
      provide: 'IConversationRepository',
      useClass: TypeOrmConversationRepository,
    },
    {
      provide: 'IMessageRepository',
      useClass: TypeOrmMessageRepository,
    },
    {
      provide: 'ISituationRepository',
      useClass: TypeOrmSituationRepository,
    },
    ConversationsService,
  ],
})
export class ConversationsModule {}
