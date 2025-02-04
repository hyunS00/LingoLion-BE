import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UpdateSituationDto } from './update-situation.dto';

export class UpdateConversationDto extends PartialType(
  OmitType(CreateConversationDto, ['situation'] as const),
) {
  @ValidateNested()
  @Type(() => UpdateSituationDto)
  situation?: UpdateSituationDto;
}
