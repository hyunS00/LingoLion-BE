import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context } from './dto/context.interface';
import { IConversationRepository } from 'src/conversations/repositories/conversation.repository.interface';
import { IMessageRepository } from 'src/conversations/repositories/message.repository.interface';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';
import { Conversation } from 'src/conversations/entities/conversation.entity';

@Injectable()
export class ContextManagerService {
  private memory: Map<string, Context> = new Map();
  private readonly logger = new Logger(ContextManagerService.name, {
    timestamp: true,
  });
  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
  ) {}

  async getConversationContext(
    conversationId: string,
    userId: string,
  ): Promise<Context> {
    this.logger.log(`${conversationId}:${userId} 컨텍스트 조회`);
    let context = this.memory.get(conversationId);
    if (context) {
      this.logger.log(`${conversationId}:${userId} 캐시 히트 ${context}`);
      return context;
    }
    this.logger.log(`${conversationId}:${userId} 캐시 미스 DB 조회`);
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      +conversationId,
      userId,
      ['messages', 'situation', 'user'],
    );
    const { messages, user, situation } = conversation;
    context = {
      conversationId: +conversationId,
      timestamp: new Date(),
      user: {
        name: user.name,
        level: 'middle',
      },
      situation: {
        place: situation.place,
        aiRole: situation.aiRole,
        userRole: situation.userRole,
        goal: situation.goal,
      },
      messages: messages
        ? messages.map((m) => ({ role: m.sender, content: m.content }))
        : [],
    };
    this.logger.log(`${conversationId}:${userId} DB 조회 컨텍스트 ${context}`);
    return context;
  }

  saveContext(conversationId: string, context: Context): void {
    this.memory.set(conversationId, context);
    const { messages } = context;
    const userMessage = messages[messages.length - 2];
    const asistentMessage = messages[messages.length - 1];
    const conversation = { id: +conversationId } as Conversation;
    const userEntity = {
      sender: userMessage.role,
      content: userMessage.content,
      conversation,
    };
    const assistentEntity = {
      sender: asistentMessage.role,
      content: asistentMessage.content,
      conversation,
    };
    this.messageRepository.saveMessages([userEntity, assistentEntity]);
  }
}
