import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  createJwtToken(
    payload: { sub: string; username: string },
    secret: string,
    expiresIn: string,
  ) {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  generateAccessToken(user: User | UserDto) {
    const payload = { sub: user.id, username: user.name };
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');
    return this.createJwtToken(payload, secret, expiresIn);
  }

  generateRefreshToken(user: User | UserDto) {
    const payload = { sub: user.id, username: user.name };

    const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    return this.createJwtToken(payload, secret, expiresIn);
  }

  generateTokens(user: User | UserDto) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  refreshAccessToken(user: User | UserDto) {
    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async join(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    return {
      accessToken: this.generateAccessToken(newUser),
      refreshToken: this.generateRefreshToken(newUser),
    };
  }

  async authenticate(email: string, password: string) {
    const exUser = await this.userService.findByEmail(email);

    if (!exUser) {
      throw new BadRequestException('계정 혹은 비밀번호가 일치하지 않습니다.');
    }

    const result = await bcrypt.compare(password, exUser.password);
    if (!result) {
      throw new BadRequestException('계정 혹은 비밀번호가 일치하지 않습니다.');
    }

    return exUser;
  }
}
