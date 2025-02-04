import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { IsEmoji } from '../decorator/isEmoji-validation.decorator';
import { SituationDto } from './situation.dto';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @IsString()
  title: string;

  @IsEmoji()
  icon: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => SituationDto)
  situation: SituationDto;
}
