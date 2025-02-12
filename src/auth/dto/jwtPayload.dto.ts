import {
  IsDate,
  IsDateString,
  IsDefined,
  IsEmail,
  IsNumber,
  IsString,
  IsVariableWidth,
  Matches,
} from 'class-validator';

export class JwtPayloadDto {
  @IsDefined()
  @IsString()
  sub: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsNumber()
  iat: number;

  @IsDefined()
  @IsNumber()
  exp: number;

  @IsDefined()
  @Matches('lingo-lion')
  iss: number;
}
