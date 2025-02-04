import { IsEmoji } from '../decorator/isEmoji-validation.decorator';

export class CreateConversationDto {
  @IsEmoji()
  icon: string;
}
