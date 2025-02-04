import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { IsEmoji } from '../decorator/isEmoji-validation.decorator';
import { CreateSituationDto } from './create-situation.dto';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @IsString()
  title: string;

  @IsEmoji()
  icon: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSituationDto)
  situation: CreateSituationDto;
}
