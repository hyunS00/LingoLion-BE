import { FindManyOptions, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from './message.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class TypeOrmMessageRepository
  extends BaseRepository<Message>
  implements IMessageRepository
{
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    super(messageRepository);
  }
  async save(messageData: Partial<Message>): Promise<Message> {
    return await this.messageRepository.save(messageData);
  }
  async saveMessages(messagesData: Partial<Message>[]): Promise<Message[]> {
    return await this.messageRepository.save(messagesData);
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
    const qb = this.createQueryBuilder('message').where(
      'message.conversationId = :conversationId',
      { conversationId },
    );
    return await this.applyDateIdPagination(qb, cursor, limit);
  }
}
