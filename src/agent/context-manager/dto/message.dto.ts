import { Sender } from 'src/conversations/entities/message.entity';

export class MessageDto {
  role: Sender;
  content: string;
}
