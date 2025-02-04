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
} from '@nestjs/common';
import { ConversationsService } from '../services/conversations.service';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Controller('conversations')
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.createConversation(createConversationDto);
  }

  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(+id);
  }

  @Get(':id/message')
  getMessagesForConversation(@Param('id') id: string) {
    return this.conversationsService.findMessagesByConversationId(+id);
  }

  @Post(':id/message')
  createMessageForConversation(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.conversationsService.createMessage(+id, createMessageDto);
  }
}
