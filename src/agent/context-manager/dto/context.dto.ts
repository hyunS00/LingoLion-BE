import { Context } from './context.interface';
import { MessageDto } from './message.dto';

export class ContextDto implements Context {
  conversationId: number;
  timestamp: Date;
  user: { name: string; level: string };
  situation: { aiRole: string; userRole: string; place: string; goal: string };
  messages: MessageDto[];
  relatedInfo: any[];
}
