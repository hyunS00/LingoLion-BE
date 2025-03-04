import { BaseRepository } from 'src/common/repositories/base.repository';
import { ISituationRepository } from './situation.repository.interface';
import { Situation } from '../entities/situation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UpdateSituationDto } from '../dto/update-situation.dto';

export class TypeOrmSituationRepository
  extends BaseRepository<Situation>
  implements ISituationRepository
{
  constructor(
    @InjectRepository(Situation)
    private readonly situationRepository: Repository<Situation>,
  ) {
    super(situationRepository);
  }
  async save(situationData: Partial<Situation>): Promise<Situation> {
    return await this.situationRepository.save(situationData);
  }
  async findOneById(id: number, relations?: string[]): Promise<Situation> {
    return await this.situationRepository.findOne({ where: { id }, relations });
  }
  async findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Situation>> {
    const qb = this.createQueryBuilder('situation').where(
      'situation.userId = :userId',
      { userId },
    );
    return await this.applyDateIdPagination(qb, cursor, limit);
  }
  async findAllWithCursor(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Situation>> {
    const qb = this.createQueryBuilder('situation');
    return await this.applyDateIdPagination(qb, cursor, limit);
  }
  async update(
    id: number,
    updateSituationDto: UpdateSituationDto,
  ): Promise<void> {
    await this.situationRepository.update(id, updateSituationDto);
  }
  async delete(id: number): Promise<void> {
    await this.situationRepository.delete(id);
  }
}
