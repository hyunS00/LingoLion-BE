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
    const SALT_ROUNDS = this.configService.get<string>('SALT_ROUNDS');

    return await bcrypt.hash(password, parseInt(SALT_ROUNDS));
  }
  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existUser) {
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.update(id, updateUserDto);

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
