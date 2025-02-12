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
    user: User | UserDto,
    secretKey: string,
    expiresInKey: string,
  ) {
    const payload = { sub: user.id, name: user.name, email: user.email };
    const secret = this.configService.get<string>(secretKey);
    const expiresIn = this.configService.get<string>(expiresInKey);
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  generateAccessToken(user: User | UserDto) {
    return this.createJwtToken(
      user,
      'JWT_ACCESS_TOKEN_SECRET',
      'JWT_ACCESS_EXPIRES_IN',
    );
  }

  generateRefreshToken(user: User | UserDto) {
    return this.createJwtToken(
      user,
      'JWT_REFRESH_TOKEN_SECRET',
      'JWT_REFRESH_EXPIRES_IN',
    );
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
    try {
      const newUser = await this.userService.create(createUserDto);
      return {
        accessToken: this.generateAccessToken(newUser),
        refreshToken: this.generateRefreshToken(newUser),
      };
    } catch (error) {
      throw error;
    }
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
