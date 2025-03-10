import { Module } from '@nestjs/common';
import { ContextManagerService } from './context-manager.service';
import { TypeOrmConversationRepository } from 'src/conversations/repositories/typeorm-conversation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { TypeOrmMessageRepository } from 'src/conversations/repositories/typeorm-message.repository';
import { Message } from 'src/conversations/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message])],
  providers: [
    {
      provide: 'IConversationRepository',
      useClass: TypeOrmConversationRepository,
    },
    {
      provide: 'IMessageRepository',
      useClass: TypeOrmMessageRepository,
    },
    ContextManagerService,
  ],
  exports: [ContextManagerService],
})
export class ContextManagerModule {}
