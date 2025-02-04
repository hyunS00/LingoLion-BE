import { IsOptional, IsString } from 'class-validator';

export class GetRecommendationsDto {
  @IsString()
  place: string;

  @IsString()
  @IsOptional()
  aiRole?: string;

  @IsString()
  @IsOptional()
  userRole?: string;

  @IsString()
  @IsOptional()
  goal?: string;
}
