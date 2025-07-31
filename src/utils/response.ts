/**
 * Standardized API Response Utilities
 * Provides consistent response format across all endpoints
 */

interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: PaginationMetadata | null;
}

interface ErrorResponse {
  success: false;
  data: null;
  metadata: null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | null;
  };
}

export class ApiResponse {
  /**
   * Create a successful response
   */
  static success<T>(data: T, metadata: PaginationMetadata | null = null): SuccessResponse<T> {
    return {
      success: true,
      data,
      metadata: metadata || undefined,
    };
  }

  /**
   * Create an error response
   */
  static error(
    code: string,
    message: string,
    details: Record<string, unknown> | null = null
  ): ErrorResponse {
    return {
      success: false,
      data: null,
      metadata: null,
      error: {
        code,
        message,
        details,
      },
    };
  }

  /**
   * Create a paginated success response
   */
  static paginated<T>(data: T[], page: number, limit: number, total: number): SuccessResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(page.toString());

    return {
      success: true,
      data,
      metadata: {
        page: currentPage,
        limit: parseInt(limit.toString()),
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  /**
   * Create a success response with a message (for operations like create, update, delete)
   */
  static created<T>(
    data: T,
    message: string = 'Resource created successfully'
  ): SuccessResponse<{ resource: T; message: string }> {
    return {
      success: true,
      data: {
        resource: data,
        message,
      },
    };
  }

  /**
   * Create a success response for updates
   */
  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully'
  ): SuccessResponse<{ resource: T; message: string }> {
    return {
      success: true,
      data: {
        resource: data,
        message,
      },
    };
  }

  /**
   * Create a success response for deletions
   */
  static deleted(
    message: string = 'Resource deleted successfully'
  ): SuccessResponse<{ message: string }> {
    return {
      success: true,
      data: {
        message,
      },
    };
  }
}

export type { ErrorResponse, PaginationMetadata, SuccessResponse };
