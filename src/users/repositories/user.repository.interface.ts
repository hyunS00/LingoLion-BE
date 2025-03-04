import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(userData: Partial<User>): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
  findOneById(id: string): Promise<User>;
  findAllWithCursor(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<User>>;
  update(id: string, userData: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
