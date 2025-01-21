import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return await this.chatsRepository.save({});
  }

  async findAll() {
    return await this.chatsRepository.find();
  }

  async findOne(id: number) {
    return await this.chatsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chat = await this.chatsRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.chatsRepository.update(
      { id },
      {
        ...updateChatDto,
      },
    );

    const updatedChat = await this.chatsRepository.findOne({ where: { id } });
    return updatedChat;
  }

  async remove(id: number) {
    const chat = await this.chatsRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.chatsRepository.delete(id);

    return id;
  }
}
