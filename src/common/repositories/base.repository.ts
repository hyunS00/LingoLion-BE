import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  encodeCursorObj,
  validateDateIdCursor,
} from '../utils/pagination.util';

export abstract class BaseRepository<
  T extends { id: string | number; createdAt: Date },
> {
  constructor(protected readonly repository: Repository<T>) {}

  protected createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  protected async applyDateIdPagination(
    qb: SelectQueryBuilder<T>,
    cursor?: string,
    limit: number = 10,
    sortDirection: 'DESC' | 'ASC' = 'DESC',
  ) {
    qb.orderBy(`${qb.alias}.createdAt`, sortDirection)
      .addOrderBy(`${qb.alias}.id`, sortDirection)
      .take(limit + 1);

    if (cursor) {
      const decodedCursor = validateDateIdCursor(cursor);
      const direction = sortDirection === 'DESC' ? '<' : '>';
      qb.andWhere(
        `(${qb.alias}.id, ${qb.alias}.createdAt) ${direction} (:id, :createdAt)`,
        decodedCursor,
      );
    }

    const items = await qb.getMany();
    const hasNextPage = items.length > limit;
    if (hasNextPage) {
      items.pop();
    }

    const endCursor =
      items.length > 0 ? this.createEndCursor(items[items.length - 1]) : null;

    return {
      data: items,
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  }

  private createEndCursor(item: T) {
    const { id, createdAt } = item;
    return encodeCursorObj({ id, createdAt });
  }
}
