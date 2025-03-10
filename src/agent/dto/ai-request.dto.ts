import { Sender } from 'src/conversations/entities/message.entity';

export interface AiRequestDto {
  conversationId: string;
  userId: string;
  content: string;
}
