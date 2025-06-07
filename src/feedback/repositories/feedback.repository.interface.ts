import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Feedback } from '../entities/feedback.entity';
import { UpdateFeedbackDto } from '../dto/update-feedback.dto';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';

export interface IFeedbackRepository {
  findOneById(id: number): Promise<Feedback>;
  findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Feedback>>;
  findByConversationIdWithCursor(
    conversationId: number,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Feedback>>;
  save(
    user: { id: string },
    createFeedbackDto: CreateFeedbackDto,
    message?: string,
  ): Promise<Feedback>;
  update(id: number, updateData: UpdateFeedbackDto): Promise<void>;
  delete(id: number): Promise<void>;
}
