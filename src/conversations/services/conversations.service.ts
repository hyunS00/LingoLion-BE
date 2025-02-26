import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Message, Sender } from '../entities/message.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { Situation } from '../entities/situation.entity';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Situation)
    private readonly situationRepository: Repository<Situation>,
    private readonly aiService: AiService,
  ) {}

  async createConversation(createConversationDto: CreateConversationDto) {
    const { situation: situationDto, ...rest } = createConversationDto;

    try {
      const situation = await this.situationRepository.save(situationDto);

      const conversation = await this.conversationsRepository.save({
        ...rest,
        situation,
      });

      return conversation;
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    return await this.conversationsRepository.find({
      relations: ['situation'],
    });
  }

  async findOne(id: number) {
    return await this.conversationsRepository.findOne({
      where: { id },
      relations: ['situation', 'messages'],
    });
  }

  async update(id: number, updateConversationDto: UpdateConversationDto) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['situation'],
    });

    if (!conversation) {
      throw new NotFoundException();
    }

    const { situation, ...rest } = updateConversationDto;

    if (situation) {
      await this.situationRepository.update(conversation.situation, situation);
    }

    if (!rest) {
      return conversation;
    }

    await this.conversationsRepository.update(
      { id },
      {
        ...conversation,
        ...rest,
      },
    );

    const updatedConversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['situation'],
    });

    return updatedConversation;
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
      relations: ['situation'],
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

    const { place, aiRole, userRole, goal } = conversation.situation;

    const template = `영어회화 장소:${place} AI 역할:${aiRole} 사용자 역할:${userRole} 대화 목표:${goal}`;
    const model = 'gpt-4o-mini';
    const context = messages.map((m) => ({
      role: m.sender,
      content: m.content,
    }));

    const res = await this.aiService.askWithContext(template, model, context);

    await this.messagesRepository.save({
      content: res.content,
      conversation,
      sender: Sender.assistant,
    });

    return { data: res };
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
