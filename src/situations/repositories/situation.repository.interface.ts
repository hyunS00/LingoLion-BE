import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { Situation } from '../entities/situation.entity';
import { UpdateSituationDto } from '../dto/update-situation.dto';

export interface ISituationRepository {
  save(situationData: Partial<Situation>): Promise<Situation>;
  findOneById(id: number, relations?: string[]): Promise<Situation>;
  findByUserIdWithCursor(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Situation>>;
  findAllWithCursor(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResponseDto<Situation>>;
  update(id: number, updateSituationDto: UpdateSituationDto): Promise<void>;
  delete(id: number): Promise<void>;
}
