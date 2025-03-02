import { FindManyOptions } from 'typeorm';
import { Message } from '../entities/message.entity';

export interface IMessageRepository {
  save(messageData: Partial<Message>): Promise<Message>;

  findByConversationId(
    conversationId: number,
    options: FindManyOptions,
  ): Promise<Message[]>;
}
