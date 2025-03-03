import { FindManyOptions, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from './message.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import {
  createEndCursor,
  validateCursor,
} from 'src/common/utils/pagination.util';

@Injectable()
export class TypeOrmMessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async save(messageData: Partial<Message>): Promise<Message> {
    return await this.messageRepository.save(messageData);
  }

  async findByConversationId(
    conversationId: number,
    options: FindManyOptions<Message | null>,
  ): Promise<Message[]> {
    const { where: optionsWhere, ...restOptions } = options || {};
    return await this.messageRepository.find({
      ...restOptions,
      where: { conversation: { id: conversationId }, ...optionsWhere },
    });
  }

  async findByConversationIdWithCursor(
    conversationId: number,
    cursor?: string,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<Message>> {
    const qb = this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .orderBy('message.id', 'DESC')
      .take(limit + 1);

    if (cursor) {
      try {
        const cursorId = validateCursor(cursor);
        qb.andWhere('message.id < :cursor', { cursor: cursorId });
      } catch (error) {
        console.error(error);
        throw new BadRequestException();
      }
    }

    const messages = await qb.getMany();

    const hasNextPage = messages.length > limit;
    if (hasNextPage) {
      messages.pop();
    }

    const endCursor = messages.length > 0 ? createEndCursor(messages) : null;

    return {
      data: messages,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  }
}
