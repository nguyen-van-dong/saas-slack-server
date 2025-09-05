import { Request } from 'express';
import { SuccessResponse } from '../dto/api-response.dto';

/**
 * Pagination metadata interface
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Creates a standardized success response
 * @param data - The data to include in the response
 * @param message - Custom success message (optional)
 * @param request - Express request object for path information
 * @returns SuccessResponse object
 */
export function successResponse<T = any>(
  data: T,
  message?: string,
  request?: Request
): SuccessResponse<T> {
  const path = request?.url;
  
  if (message) {
    return new SuccessResponse(message, data, path);
  }
  
  // Auto-generate message based on data type
  const autoMessage = generateAutoMessage(data);
  return new SuccessResponse(autoMessage, data, path);
}

/**
 * Creates a standardized paginated success response
 * @param data - Array of data items
 * @param page - Current page number
 * @param limit - Number of items per page
 * @param total - Total number of items
 * @param message - Custom success message (optional)
 * @param request - Express request object for path information
 * @returns SuccessResponse with paginated data
 */
export function successResponsePaginate<T = any>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string,
  request?: Request
): SuccessResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginationMeta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };

  const paginatedData: PaginatedResponse<T> = {
    data,
    meta: paginationMeta,
  };

  const path = request?.url;
  const autoMessage = message || generatePaginatedMessage(data.length, total, page, totalPages);
  
  return new SuccessResponse(autoMessage, paginatedData, path);
}

/**
 * Creates a paginated response with custom metadata
 * @param data - Array of data items
 * @param meta - Custom pagination metadata
 * @param message - Custom success message (optional)
 * @param request - Express request object for path information
 * @returns SuccessResponse with custom paginated data
 */
export function successResponsePaginateCustom<T = any>(
  data: T[],
  meta: PaginationMeta,
  message?: string,
  request?: Request
): SuccessResponse<PaginatedResponse<T>> {
  const paginatedData: PaginatedResponse<T> = {
    data,
    meta,
  };

  const path = request?.url;
  const autoMessage = message || generatePaginatedMessage(data.length, meta.total, meta.page, meta.totalPages);
  
  return new SuccessResponse(autoMessage, paginatedData, path);
}

/**
 * Auto-generates success message based on data type
 */
function generateAutoMessage(data: any): string {
  if (Array.isArray(data)) {
    const count = data.length;
    if (count === 0) return 'No data found';
    if (count === 1) return 'Item retrieved successfully';
    return `${count} items retrieved successfully`;
  }

  if (typeof data === 'object' && data !== null) {
    if (data.user) return 'User operation completed successfully';
    if (data.id) return 'Item retrieved successfully';
    return 'Data retrieved successfully';
  }

  return 'Operation completed successfully';
}

/**
 * Auto-generates paginated success message
 */
function generatePaginatedMessage(
  count: number,
  total: number,
  page: number,
  totalPages: number
): string {
  if (count === 0) {
    return 'No data found';
  }

  if (totalPages === 1) {
    return `All ${total} items retrieved successfully`;
  }

  return `Retrieved ${count} of ${total} items (page ${page} of ${totalPages})`;
}

/**
 * Helper function to create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Helper function to calculate pagination offset
 */
export function calculatePaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Helper function to validate pagination parameters
 */
export function validatePaginationParams(page: number, limit: number): {
  page: number;
  limit: number;
} {
  const validPage = Math.max(1, Math.floor(page) || 1);
  const validLimit = Math.max(1, Math.min(100, Math.floor(limit) || 10)); // Max 100 items per page
  
  return {
    page: validPage,
    limit: validLimit,
  };
}
