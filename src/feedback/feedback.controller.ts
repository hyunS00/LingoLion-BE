import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { AuthUser } from 'src/users/decorator/authUser.decorator';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/users/entities/user.entity';

@Controller('feedback')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':userId')
  @Roles(Role.Admin)
  create(
    @Param('id') userId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(userId, createFeedbackDto);
  }

  @Get('my')
  findUserFeedback(
    @AuthUser('id') userId: string,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return this.feedbackService.findUserFeedback(userId, cursorPaginationDto);
  }

  @Get('conversation/:conversationId')
  findConversationFeedback(
    @AuthUser('id') userId: string,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return this.feedbackService.findConversationFeedback(
      userId,
      conversationId,
      cursorPaginationDto,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.remove(id);
  }
}
