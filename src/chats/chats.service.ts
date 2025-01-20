import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    return await this.chatRepository.save({});
  }

  async findAll() {
    return await this.chatRepository.find();
  }

  async findOne(id: number) {
    return await this.chatRepository.findOne({ where: { id } });
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chat = await this.chatRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.chatRepository.update(
      { id },
      {
        ...updateChatDto,
      },
    );

    const updatedChat = await this.chatRepository.findOne({ where: { id } });
    return updatedChat;
  }

  async remove(id: number) {
    const chat = await this.chatRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.chatRepository.delete(id);

    return id;
  }
}
