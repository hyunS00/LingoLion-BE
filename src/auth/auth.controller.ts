import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Public } from './decorator/public.decorator';
import { Request, Response } from 'express';
import { BasicAuthGuard } from './gaurd/basicAuth.guard';
import { OpaqueRefreshAuthGuard } from './gaurd/opaqueRefreshAuth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('join')
  async join(@Body() createUserDto: CreateUserDto) {
    return await this.authService.join(createUserDto);
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @Post('login')
  async signin(
    @Req() req: Request & { user: UserDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getAccessAndRefreshToken(req.user, res);
  }

  @UseGuards(OpaqueRefreshAuthGuard)
  @Post('logout')
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'prod',
      sameSite: 'strict',
    });

    return 'logout ok';
  }

  @Public()
  @UseGuards(OpaqueRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: Request & { user: UserDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.getAccessAndRefreshToken(req.user, res);
  }

  async getAccessAndRefreshToken(user: UserDto, res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'prod',
      sameSite: 'strict',
    });

    return { accessToken };
  }
}
