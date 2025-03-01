import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, Sender } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AiService } from 'src/ai/ai.service';
import { Situation } from 'src/situations/entities/situation.entity';
import { PromptService } from 'src/ai/prompt/prompt.service';

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
    private readonly promptService: PromptService,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
    userId: string,
  ) {
    const { situationId, ...restDto } = createConversationDto;
    const user = { id: userId };
    const situation = await this.situationRepository.findOne({
      where: { id: situationId },
    });

    if (!situation) {
      throw new NotFoundException();
    }

    const conversation = await this.conversationsRepository.save({
      ...restDto,
      situation,
      user,
    });
    return conversation;
  }

  async findAll() {
    return await this.conversationsRepository.find({
      relations: ['situation'],
    });
  }

  async findUserConversation(id: number, userId: string) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['situation', 'messages', 'user'],
    });

    if (!conversation || conversation.user?.id !== userId) {
      throw new ForbiddenException();
    }

    return conversation;
  }

  async updateUserConversation(
    id: number,
    updateConversationDto: UpdateConversationDto,
    userId: string,
  ) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!conversation || conversation.user?.id !== userId) {
      throw new ForbiddenException();
    }

    await this.conversationsRepository.update({ id }, updateConversationDto);

    const updatedConversation = await this.conversationsRepository.findOne({
      where: { id },
    });

    return updatedConversation;
  }

  async removeUserConversation(id: number, userId: string) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!conversation || conversation.user?.id !== userId) {
      throw new ForbiddenException();
    }

    await this.conversationsRepository.delete(id);

    return id;
  }

  async createMessageInUserConversation(
    id: number,
    createMessageDto: CreateMessageDto,
    userId: string,
  ) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['situation', 'user'],
    });

    if (!conversation || conversation.user?.id !== userId) {
      throw new ForbiddenException();
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

    const template = this.promptService.buildSituationPrompt(
      conversation.situation,
    );
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

  async findUserConversationMessages(id: number, userId: string) {
    const conversation = await this.conversationsRepository.findOne({
      where: { id },
      relations: ['user', 'messages'],
    });

    if (!conversation || conversation.user.id !== userId) {
      throw new ForbiddenException();
    }

    return conversation.messages;
  }
}
