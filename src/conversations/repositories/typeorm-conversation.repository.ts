import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { IConversationRepository } from './conversation.repository.interface';
import { Repository } from 'typeorm';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import {
  createEndCursorId,
  decodeCursorId,
  validateCursor,
} from 'src/common/utils/pagination.util';

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
  async findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Conversation>> {
    const qb = this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.userId = :userId', { userId })
      .orderBy('conversation.id', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      try {
        const decodedCursor = decodeCursorId(cursor);
        const parsedCursor = JSON.stringify(decodedCursor);
        const cursorId = validateCursor(parsedCursor);
        qb.andWhere('conversation.id < :id', { id: cursorId });
      } catch (error) {
        console.error(error);
        throw new BadRequestException('잘못된 커서 포맷');
      }
    }

    const conversations = await qb.getMany();

    const hasNextPage = conversations.length > limit;
    if (hasNextPage) {
      conversations.pop();
    }

    const endCursor =
      conversations.length > 0 ? createEndCursorId(conversations) : null;

    return {
      data: conversations,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
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
