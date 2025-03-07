import { Sender } from 'src/conversations/entities/message.entity';

export interface AiRequestDto {
  conversationId: string; // 세션 식별자 (옵션)
  userId: string;
  content: string; // 사용자 메시지
  context: {
    situation: {
      userRole: string;
      aiRole: string;
      place: string;
      goal: string;
    };
    history?: Array<{ role: Sender; content: string }>;
    [key: string]: any;
  };
  options?: {
    search?: boolean;
    [key: string]: any;
  };
}
