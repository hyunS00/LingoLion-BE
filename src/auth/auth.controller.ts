import {
  Body,
  Controller,
  Header,
  Headers,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGaurd } from './strategy/local.strategy';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  async join(@Body() createUserDto: CreateUserDto) {
    return await this.authService.join(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGaurd)
  signin(@Request() user: UserDto) {
    return this.authService.generateTokens(user);
  }
}
