import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { RoutingModule } from './routing/routing.module';
import { SearchModule } from './search/search.module';
import { AiModule } from 'src/ai/ai.module';
import { RoutingService } from './routing/routing.service';
import { PromptModule } from 'src/ai/prompt/prompt.module';
import { TypeOrmConversationRepository } from 'src/conversations/repositories/typeorm-conversation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { Message } from 'src/conversations/entities/message.entity';
import { TypeOrmMessageRepository } from 'src/conversations/repositories/typeorm-message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    RoutingModule,
    SearchModule,
    AiModule,
    PromptModule,
  ],
  providers: [
    {
      provide: 'IMessageRepository',
      useClass: TypeOrmMessageRepository,
    },
    AgentService,
    RoutingService,
  ],
  exports: [AgentService],
})
export class AgentModule {}
