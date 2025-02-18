import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { LocalAuthGuard } from './gaurd/localAuth.guard';
import { Public } from './decorator/public.decorator';
import { JwtRefreshAuthGuard } from './gaurd/jwtRefreshAuth.guard';
import { Request, Response } from 'express';
import { BasicAuthGuard } from './gaurd/basicAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('join')
  async join(@Body() createUserDto: CreateUserDto) {
    return await this.authService.join(createUserDto);
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @Post('login')
  signin(
    @Req() req: Request & { user: UserDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = this.authService.generateTokens(
      req.user,
    );

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { accessToken };
  }

  // @Public()
  // @UseGuards(JwtRefreshAuthGuard)
  // @Post('refresh')
  // refreshToken(@Request() req: { user: UserDto }) {
  //   return this.authService.refreshAccessToken(req.user);
  // }
}
