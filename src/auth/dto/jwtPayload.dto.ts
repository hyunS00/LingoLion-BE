import {
  IsDate,
  IsDateString,
  IsDefined,
  IsEmail,
  IsNumber,
  IsString,
} from 'class-validator';

export class JwtPayloadDto {
  @IsDefined()
  @IsString()
  sub: string;

  // @IsDefined()
  // @IsEmail()
  // email: string;

  @IsDefined()
  @IsNumber()
  iat: number;

  @IsDefined()
  @IsNumber()
  exp: number;
}
