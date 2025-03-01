import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/users/decorator/authUser.decorator';

@Controller('conversations')
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @AuthUser('id') userId: string,
  ) {
    return this.conversationsService.createConversation(
      createConversationDto,
      userId,
    );
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOneForUser(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') userId: string,
  ) {
    return this.conversationsService.findUserConversation(id, userId);
  }

  @Patch(':id')
  updateForUser(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') userId: string,
    @Body() updateChatDto: UpdateConversationDto,
  ) {
    return this.conversationsService.updateUserConversation(
      id,
      updateChatDto,
      userId,
    );
  }

  @Delete(':id')
  removeForUser(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') userId: string,
  ) {
    return this.conversationsService.removeUserConversation(id, userId);
  }

  @Get(':id/message')
  getMessagesForConversation(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') userId: string,
  ) {
    return this.conversationsService.findUserConversationMessages(id, userId);
  }

  @Post(':id/message')
  createMessageForConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
    @AuthUser('id') userId: string,
  ) {
    return this.conversationsService.createMessageInUserConversation(
      id,
      createMessageDto,
      userId,
    );
  }
}
