import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './gaurd/localAuth.guard';
import { Public } from './decorator/public.decorator';
import { JwtRefreshAuthGuard } from './gaurd/jwtRefreshAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('join')
  async join(@Body() createUserDto: CreateUserDto) {
    return await this.authService.join(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signin(@Request() req: { user: UserDto }) {
    return this.authService.generateTokens(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req: { user: UserDto }) {
    return this.authService.refreshAccessToken(req.user);
  }
}
