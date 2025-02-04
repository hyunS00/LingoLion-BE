import { PartialType } from '@nestjs/mapped-types';
import { SituationDto } from './situation.dto';

export class UpdateSituationDto extends PartialType(SituationDto) {}
