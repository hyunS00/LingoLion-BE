import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, Sender } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>,
  ) {}

  async create(chatId: number, createMessageDto: CreateMessageDto) {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });

    if (!chat) {
      throw new NotFoundException();
    }

    return await this.messagesRepository.save({
      ...createMessageDto,
      chat,
      sender: Sender.user,
    });
  }

  async findAllByChatId(chatId: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException();
    }

    return await this.messagesRepository.findAndCount({
      where: {
        chat: {
          id: chatId,
        },
      },
    });
  }

  async findOne(id: number) {
    const message = await this.messagesRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException();
    }

    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException();
    }

    await this.messagesRepository.update({ id }, updateMessageDto);

    return await this.messagesRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const message = await this.messagesRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException();
    }

    await this.messagesRepository.delete(id);

    return id;
  }
}
