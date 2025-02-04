import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message, Sender } from '../entities/message.entity';
import { OpenAIService } from 'src/openAI/openAI.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly openAiService: OpenAIService,
  ) {}

  async createConversation() {
    return await this.conversationsRepository.save({});
  }

  async findAll() {
    return await this.conversationsRepository.find();
  }

  async findOne(id: number) {
    return await this.conversationsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateChatDto: UpdateConversationDto) {
    const chat = await this.conversationsRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.conversationsRepository.update(
      { id },
      {
        ...updateChatDto,
      },
    );

    const updatedChat = await this.conversationsRepository.findOne({
      where: { id },
    });
    return updatedChat;
  }

  async remove(id: number) {
    const chat = await this.conversationsRepository.findOne({ where: { id } });

    if (!chat) {
      throw new NotFoundException();
    }

    await this.conversationsRepository.delete(id);

    return id;
  }

  async createMessage(id: number, createMessageDto: CreateMessageDto) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException();
    }

    await this.messagesRepository.save({
      ...createMessageDto,
      conversation,
      sender: Sender.user,
    });

    const messages = await this.messagesRepository.find({
      select: ['sender', 'content'],
      where: { conversation: { id } },
      order: { createdAt: 'ASC' },
    });

    const res = await this.openAiService.test(
      messages.map((m) => ({
        role: m.sender,
        content: m.content,
      })),
    );

    await this.messagesRepository.save({
      content: res.content,
      conversation,
      sender: Sender.assistant,
    });

    return { data: res, comment: 'adshfdask' };
  }

  async findMessagesByConversationId(id: number) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
    });

    if (!conversation) {
      throw new NotFoundException();
    }

    return await this.messagesRepository.find({
      where: { conversation: { id } },
    });
  }
}
