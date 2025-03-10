import { MessageDto } from './message.dto';

export interface Context {
  conversationId: number;
  timestamp: Date;
  user: {
    name: string;
    level: string;
  };
  situation: {
    aiRole: string;
    userRole: string;
    place: string;
    goal: string;
  };
  messages: MessageDto[];
  relatedInfo?: any[];
}
