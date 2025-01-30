import { IsOptional, IsString } from 'class-validator';

export class GetRecommendationsDto {
  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  aiRole?: string;

  @IsOptional()
  @IsString()
  userRole?: string;

  @IsOptional()
  @IsString()
  goal?: string;
}
