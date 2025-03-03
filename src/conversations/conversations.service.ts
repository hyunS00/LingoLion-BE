import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, Sender } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AiService } from 'src/ai/ai.service';
import { Situation } from 'src/situations/entities/situation.entity';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { IConversationRepository } from './repositories/conversation.repository.interface';
import { IMessageRepository } from './repositories/message.repository.interface';

@Injectable()
export class ConversationsService {
  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    @Inject('IMessageRepository')
    private readonly messagesRepository: IMessageRepository,
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

    const conversation = await this.conversationRepository.save({
      ...restDto,
      situation,
      user,
    });
    return conversation;
  }

  async findAll() {
    const relations = ['situation'];
    return await this.conversationRepository.findAll(relations);
  }

  async findUserConversation(id: number, userId: string) {
    const relations = ['situation', 'messages'];
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      id,
      userId,
      relations,
    );

    if (!conversation) {
      throw new ForbiddenException();
    }

    return conversation;
  }

  async updateUserConversation(
    id: number,
    updateConversationDto: UpdateConversationDto,
    userId: string,
  ) {
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      id,
      userId,
    );

    if (!conversation) {
      throw new ForbiddenException();
    }

    await this.conversationRepository.update(id, updateConversationDto);

    const updatedConversation =
      await this.conversationRepository.findOneById(id);

    return updatedConversation;
  }

  async removeUserConversation(id: number, userId: string) {
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      id,
      userId,
    );

    if (!conversation) {
      throw new ForbiddenException();
    }

    await this.conversationRepository.delete(id);

    return id;
  }

  async createMessageInUserConversation(
    conversationId: number,
    createMessageDto: CreateMessageDto,
    userId: string,
  ) {
    const relations = ['situation'];
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      conversationId,
      userId,
      relations,
    );

    if (!conversation) {
      throw new ForbiddenException();
    }

    await this.messagesRepository.save({
      ...createMessageDto,
      conversation,
      sender: Sender.user,
    });

    const messages = await this.messagesRepository.findByConversationId(
      conversationId,
      {
        select: ['sender', 'content'],
        order: { createdAt: 'ASC' },
      },
    );

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

  async findUserConversationMessages(
    id: number,
    userId: string,
    cusor: string,
    limit: number,
  ) {
    const conversation = await this.conversationRepository.findOneByIdAndUserId(
      id,
      userId,
    );

    if (!conversation) {
      throw new ForbiddenException();
    }

    return await this.messagesRepository.findByConversationIdWithCursor(
      id,
      cusor,
      limit,
    );
  }
}
