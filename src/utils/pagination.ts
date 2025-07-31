/**
 * Pagination Utilities
 * Provides standardized pagination logic and validation
 */

export interface PaginationParams {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export class PaginationUtils {
  /**
   * Parse and validate pagination parameters from query string
   */
  static parsePaginationParams(
    query: PaginationParams,
    defaultSortBy: string = 'createdAt',
    maxLimit: number = 100
  ): PaginationOptions {
    // Parse page - ensure it's at least 1
    let page = parseInt(String(query.page || 1));
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    // Parse limit - ensure it's within bounds
    let limit = parseInt(String(query.limit || 10));
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }
    if (limit > maxLimit) {
      limit = maxLimit;
    }

    // Calculate skip - this will always be >= 0 now
    const skip = (page - 1) * limit;

    // Parse sort order
    const sortOrder: 'asc' | 'desc' =
      query.sortOrder === 'asc' || query.sortOrder === 'desc' ? query.sortOrder : 'desc';

    // Parse sort field
    const sortBy = query.sortBy || defaultSortBy;

    return {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    };
  }

  /**
   * Create pagination metadata
   */
  static createMetadata(page: number, limit: number, total: number): PaginationMetadata {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Create a paginated result object
   */
  static createPaginatedResult<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): PaginatedResult<T> {
    return {
      data,
      pagination: this.createMetadata(page, limit, total),
    };
  }

  /**
   * Create Prisma-compatible order by object
   */
  static createOrderBy(sortBy: string, sortOrder: 'asc' | 'desc'): Record<string, 'asc' | 'desc'> {
    return { [sortBy]: sortOrder };
  }

  /**
   * Create search filter for common text fields
   */
  static createTextSearchFilter(
    search: string,
    fields: string[]
  ): { OR: Array<Record<string, { contains: string; mode: 'insensitive' }>> } {
    return {
      OR: fields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const,
        },
      })),
    };
  }
}
