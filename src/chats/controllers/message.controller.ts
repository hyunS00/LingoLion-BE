import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Post()
  create(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(+chatId, createMessageDto);
  }

  @Get()
  findAllByChatId(@Param('chatId') chatId: string) {
    return this.messagesService.findAllByChatId(+chatId);
  }

  @Get(':messageId')
  findOne(@Param('messageId') messageId: string) {
    return this.messagesService.findOne(+messageId);
  }

  @Patch(':messageId')
  update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(+messageId, updateMessageDto);
  }

  @Delete(':messageId')
  remove(@Param('messageId') messageId: string) {
    return this.messagesService.remove(+messageId);
  }
}
