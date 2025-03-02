import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { IConversationRepository } from './conversation.repository.interface';
import { Repository } from 'typeorm';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}
  async findOneById(
    id: number,
    relations?: string[],
  ): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations,
    });
  }
  async save(
    conversationData: Pick<Conversation, 'title' | 'icon' | 'situation'> & {
      user: { id: string };
    },
  ): Promise<Conversation> {
    return await this.conversationRepository.save(conversationData);
  }
  async findAll(relations?: string[]): Promise<Conversation[] | null> {
    return await this.conversationRepository.find({ relations });
  }
  async findOneByIdAndUserId(
    id: number,
    userId: string,
    relations?: string[],
  ): Promise<Conversation> {
    const user = { id: userId };
    return await this.conversationRepository.findOne({
      where: { id, user },
      relations,
    });
  }
  async update(id: number, updateData: UpdateConversationDto): Promise<void> {
    await this.conversationRepository.update(id, updateData);
  }
  async delete(id: number): Promise<void> {
    await this.conversationRepository.delete(id);
  }
}
