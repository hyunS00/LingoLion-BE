import { FindManyOptions } from 'typeorm';
import { Message } from '../entities/message.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

export interface IMessageRepository {
  save(messageData: Partial<Message>): Promise<Message>;
  saveMessages(messagesData: Partial<Message>[]): Promise<Message[]>;
  findByConversationId(
    conversationId: number,
    options: FindManyOptions,
  ): Promise<Message[]>;
  findByConversationIdWithCursor(
    conversationId: number,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Message>>;
}
