import { IsDefined, IsNumber, IsObject, IsString } from 'class-validator';
import { IsEmoji } from '../decorator/isEmoji-validation.decorator';
import { ConversationMetaData } from './conversationMetadata.dto';

export class CreateConversationDto {
  @IsString()
  title: string;

  @IsEmoji()
  icon: string;

  @IsDefined()
  @IsNumber()
  situationId: number;

  @IsObject({ each: true })
  metaData: ConversationMetaData;
}
