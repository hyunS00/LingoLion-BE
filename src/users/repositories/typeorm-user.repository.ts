import { BaseRepository } from 'src/common/repositories/base.repository';
import { IUserRepository } from './user.repository.interface';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TypeOrmUserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
  async save(userData: Partial<User>): Promise<User> {
    return await this.userRepository.save(userData);
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async update(id: string, userData: Partial<User>): Promise<void> {
    await this.userRepository.update(id, userData);
  }
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
  async findAllWithCursor(cursor?: string, limit: number = 10) {
    const qb = this.createQueryBuilder('user');
    return await this.applyDateIdPagination(qb, cursor, limit);
  }
}
