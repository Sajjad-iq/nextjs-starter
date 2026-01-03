export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isActivated?: boolean;
    createdAt?: string;
}


/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
    page: number;
    size: number;
}

/**
 * Pagination metadata for paginated API responses
 */
export interface PaginationMeta {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

/**
 * Standard API Response structure
 * Used across all API endpoints for consistency
 */
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    errorCode?: string;
    data?: T;
    pagination?: PaginationMeta;
}
