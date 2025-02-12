import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자 또는 특수 문자를 포함해야 합니다.',
  })
  password: string;

  @IsString()
  name: string;
}
