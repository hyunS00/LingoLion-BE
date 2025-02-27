import { IsString } from 'class-validator';

export class SituationDto {
  @IsString()
  place: string;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsString()
  goal: string;
}
