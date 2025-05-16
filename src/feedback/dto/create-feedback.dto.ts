import { IsNumber, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNumber()
  conversationId: number;

  @IsString()
  content: string;
}
