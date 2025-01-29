import { IsString } from 'class-validator';
import { Sender } from '../entities/message.entity';

export class CreateMessageDto {
  @IsString()
  role = Sender.user;
  @IsString()
  content: string;
}
