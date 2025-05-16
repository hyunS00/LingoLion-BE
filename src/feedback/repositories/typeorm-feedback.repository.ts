import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { UpdateFeedbackDto } from '../dto/update-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { IFeedbackRepository } from './feedback.repository.interface';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmFeedbackRepository
  extends BaseRepository<Feedback>
  implements IFeedbackRepository
{
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {
    super(feedbackRepository);
  }
  async findOneById(id: number): Promise<Feedback> {
    return await this.feedbackRepository.findOne({ where: { id } });
  }
  async findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Feedback>> {
    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.userId = :userId', { userId });

    return await this.applyDateIdPagination(qb, cursor, limit);
  }
  async findByConversationIdWithCursor(
    conversationId: number,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Feedback>> {
    const qb = this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.conversationId = :conversationId', { conversationId });

    return await this.applyDateIdPagination(qb, cursor, limit);
  }

  async save(
    user: { id: string },
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return await this.feedbackRepository.save({
      ...createFeedbackDto,
      conversation: { id: createFeedbackDto.conversationId },
      user,
    });
  }

  async update(id: number, updateData: UpdateFeedbackDto): Promise<void> {
    await this.feedbackRepository.update(id, updateData as Partial<Feedback>);
  }
  async delete(id: number): Promise<void> {
    await this.feedbackRepository.delete(id);
  }
}
