import { IsString } from 'class-validator';

export class CreateSituationDto {
  @IsString()
  place: string;

  @IsString()
  aiRole: string;

  @IsString()
  userRole: string;

  @IsString()
  goal: string;
}
