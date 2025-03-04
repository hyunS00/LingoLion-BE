import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from './repositories/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string) {
    const SALT_ROUNDS = parseInt(this.configService.get<string>('SALT_ROUNDS'));

    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const exUser = await this.userRepository.findOneByEmail(email);
    if (exUser) {
      throw new ConflictException();
    }
    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });

    return user;
  }

  async findAll(cursor?: string, limit: number = 10) {
    return await this.userRepository.findAllWithCursor(cursor, limit);
  }

  async findOne(id: string) {
    return await this.userRepository.findOneById(id);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }
    let hashedPassword: string;
    const { password, ...restField } = updateUserDto;

    if (updateUserDto.password) {
      hashedPassword = await this.hashPassword(password);
    }

    await this.userRepository.update(id, {
      ...restField,
      ...(hashedPassword && { password: hashedPassword }),
    });

    const updatedUser = this.userRepository.findOneById(id);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.delete(id);

    return id;
  }
}
