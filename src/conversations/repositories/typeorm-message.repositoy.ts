import { FindManyOptions, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { IMessageRepository } from './message.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';

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
    options: FindManyOptions<Message>,
  ): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      ...options,
    });
  }
}
