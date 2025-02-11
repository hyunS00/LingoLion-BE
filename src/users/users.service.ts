import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string) {
    const SALT_ROUNDS = parseInt(this.configService.get<string>('SALT_ROUNDS'));

    return await bcrypt.hash(password, SALT_ROUNDS);
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const exUser = await this.userRepository.findOne({
      where: { email },
    });
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

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['createdAt', 'email', 'id', 'name', 'password'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
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

    const updatedUser = this.userRepository.findOne({ where: { id } });
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.delete(id);

    return id;
  }
}
