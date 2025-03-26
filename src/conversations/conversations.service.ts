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
import { ISituationRepository } from 'src/situations/repositories/situation.repository.interface';
import { AgentService } from 'src/agent/agent.service';
import { AiRequestDto } from 'src/agent/dto/ai-request.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @Inject('IConversationRepository')
    private readonly conversationRepository: IConversationRepository,
    @Inject('IMessageRepository')
    private readonly messagesRepository: IMessageRepository,
    @Inject('ISituationRepository')
    private readonly situationRepository: ISituationRepository,
    private readonly agentService: AgentService,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
    userId: string,
  ) {
    const { situationId, ...restDto } = createConversationDto;
    const user = { id: userId };
    const situation = await this.situationRepository.findOneById(situationId);

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

  async findUserConversations(userId: string, cursor?: string, limit?: number) {
    const conversations =
      await this.conversationRepository.findByUserIdWithCursor(
        userId,
        cursor,
        limit,
      );

    return conversations;
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

    const aiRequest: AiRequestDto = {
      conversationId: conversationId.toString(),
      userId,
      content: createMessageDto.content,
    };
    const res = await this.agentService.processMessage(aiRequest);

    return res;
  }

  async createMessageInUserConversationStream(
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

    const aiRequest: AiRequestDto = {
      conversationId: conversationId.toString(),
      userId,
      content: createMessageDto.content,
    };
    const res = await this.agentService.processMessageStream(aiRequest);

    return res;
  }

  async findUserConversationMessages(
    id: number,
    userId: string,
    cursor: string,
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
      cursor,
      limit,
    );
  }
}
