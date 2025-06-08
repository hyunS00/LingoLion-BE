import { IsNumber, IsObject, IsString } from 'class-validator';
import { DetailedFeedback } from '../entities/feedback.entity';

export class CreateFeedbackDto {
  @IsNumber()
  conversationId: number;

  @IsObject({ each: true })
  detailedFeedback: DetailedFeedback;
}
