export class PaginatedResponseDto<T> {
  data: T[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}
