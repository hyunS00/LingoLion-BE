import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserIdRoleDto } from '../users/dto/userIdRole.dto';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createJwtToken(payload: any, secretKey: string, expiresInKey: string) {
    const secret = this.configService.get<string>(secretKey);
    const expiresIn = this.configService.get<string>(expiresInKey);
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  createOpaqueToken() {
    return randomBytes(32).toString('hex');
  }

  generateAccessToken(user: UserIdRoleDto) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    return this.createJwtToken(
      payload,
      'JWT_ACCESS_TOKEN_SECRET',
      'JWT_ACCESS_EXPIRES_IN',
    );
  }

  async generateRefreshToken(userId: string) {
    const opaqueToken = this.createOpaqueToken();

    const saltRouds = parseInt(this.configService.get<string>('SALT_ROUNDS'));
    const hashedSecret = await bcrypt.hash(opaqueToken, saltRouds);
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const expiresAt = new Date();
      expiresAt.setDate(
        expiresAt.getDate() +
          parseInt(this.configService.get<string>('REFRESH_EXPIRES_IN')),
      );

      const record = await this.refreshTokenRepository.save({
        expiresAt,
        user,
        hashedSecret,
      });
      return `${record.id}.${opaqueToken}`;
    } catch (err) {
      throw new ServiceUnavailableException();
    }
  }

  async generateTokens(user: UserIdRoleDto | User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  refreshAccessToken(user: UserIdRoleDto) {
    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async join(createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return 'sign ok';
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

  async validateRefreshToken(tokenId: string, secret: string): Promise<User> {
    try {
      const record = await this.refreshTokenRepository.findOne({
        where: { id: tokenId },
        relations: ['user'],
      });

      if (!record) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(secret, record.hashedSecret);

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      await this.refreshTokenRepository.delete(record.id);

      const now = new Date();
      if (record.expiresAt < now) {
        throw new UnauthorizedException();
      }

      return record.user;
    } catch (error) {
      throw error;
    }
  }
}
