import { PaginationMeta } from '../dto/pagination.dto.js';

export function calculatePagination(
  totalItems: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

