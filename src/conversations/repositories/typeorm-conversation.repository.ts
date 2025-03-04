import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { IConversationRepository } from './conversation.repository.interface';
import { Repository } from 'typeorm';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { validateCursorId } from 'src/common/utils/pagination.util';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class TypeOrmConversationRepository
  extends BaseRepository<Conversation>
  implements IConversationRepository
{
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {
    super(conversationRepository);
  }

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
  async findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Conversation>> {
    const qb = this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.userId = :userId', { userId });

    return await this.applyDateIdPagination(qb, cursor, limit);
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
