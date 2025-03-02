import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { Conversation } from '../entities/conversation.entity';

export interface IConversationRepository {
  findOneById(id: number, relations?: string[]): Promise<Conversation>;
  save(
    conversationData: Pick<Conversation, 'title' | 'icon' | 'situation'> & {
      user: { id: string };
    },
  ): Promise<Conversation>;
  findAll(relations?: string[]): Promise<Conversation[]>;
  findOneByIdAndUserId(
    id: number,
    userId: string,
    relations?: string[],
  ): Promise<Conversation>;
  update(id: number, updateData: UpdateConversationDto): Promise<void>;
  delete(id: number): Promise<void>;
}
