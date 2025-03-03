import { IsInt, IsOptional, IsString } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  limit?: number = 10;
}
