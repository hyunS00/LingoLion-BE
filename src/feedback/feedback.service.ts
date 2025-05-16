import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { IFeedbackRepository } from './repositories/feedback.repository.interface';
import { IUserRepository } from 'src/users/repositories/user.repository.interface';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { IConversationRepository } from 'src/conversations/repositories/conversation.repository.interface';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('IFeedbackRepository')
    private readonly feedbackRepository: IFeedbackRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async create(userId: string, createFeedbackDto: CreateFeedbackDto) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new UnauthorizedException();

    await this.feedbackRepository.save({ id: userId }, createFeedbackDto);
  }

  async findOne(id: number) {
    return await this.feedbackRepository.findOneById(id);
  }

  async findUserFeedback(
    userId: string,
    cursorPaginationDto: CursorPaginationDto,
  ) {
    const { cursor, limit } = cursorPaginationDto;
    return await this.feedbackRepository.findByUserIdWithCursor(
      userId,
      cursor,
      limit,
    );
  }

  async findConversationFeedback(
    userId: string,
    conversationId: number,
    cursorPaginationDto: CursorPaginationDto,
  ) {
    const conversation = await this.conversationRepository.findOneById(
      conversationId,
      ['user'],
    );
    if (!conversation) throw new NotFoundException();
    if (conversation.user.id !== userId) throw new UnauthorizedException();

    const { cursor, limit } = cursorPaginationDto;
    return await this.feedbackRepository.findByConversationIdWithCursor(
      conversationId,
      cursor,
      limit,
    );
  }

  async remove(id: number) {
    return await this.feedbackRepository.delete(id);
  }
}
