import { Sender } from 'src/conversations/entities/message.entity';

export interface AiRequestDto {
  conversationId: number;
  userId: string;
  content: string;
}
