import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { PaginationParams } from '@/types/global';
import type { ServerPaginationState } from '@/components/common/dataTable';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

export interface UsePaginationParamsOptions {
  defaultSize?: number;
  pageSizeOptions?: number[];
}

/**
 * Pagination change event - single function for all pagination changes
 */
export interface PaginationChangeEvent {
  page?: number;
  size?: number;
}

export interface UsePaginationParamsReturn {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  paginationParams: PaginationParams;
  serverPagination: ServerPaginationState;
  onPaginate: (event: PaginationChangeEvent) => void;
  setTotals: (totalElements: number, totalPages: number) => void;
  resetPagination: () => void;
}

/**
 * Hook for managing pagination state via URL search params
 * Makes pagination shareable and bookmarkable
 */
export function usePaginationParams(
  options: UsePaginationParamsOptions = {}
): UsePaginationParamsReturn {
  const { defaultSize = DEFAULT_SIZE } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse pagination from URL params
  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    const parsed = pageParam ? parseInt(pageParam, 10) : DEFAULT_PAGE;
    return isNaN(parsed) || parsed < 0 ? DEFAULT_PAGE : parsed;
  }, [searchParams]);

  const size = useMemo(() => {
    const sizeParam = searchParams.get('size');
    const parsed = sizeParam ? parseInt(sizeParam, 10) : defaultSize;
    return isNaN(parsed) || parsed < 1 ? defaultSize : parsed;
  }, [searchParams, defaultSize]);

  // Response totals (set after fetch)
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Combined pagination params object
  const paginationParams: PaginationParams = useMemo(() => ({
    page,
    size,
  }), [page, size]);

  // Server pagination state ready for DataTable
  const serverPagination: ServerPaginationState = useMemo(() => ({
    page,
    size,
    totalElements,
    totalPages,
  }), [page, size, totalElements, totalPages]);

  // Single function to handle all pagination changes
  const onPaginate = useCallback((event: PaginationChangeEvent) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      // Handle page size change (resets page to 0)
      if (event.size !== undefined) {
        params.delete('page'); // Reset to first page when size changes
        if (event.size === defaultSize) {
          params.delete('size');
        } else {
          params.set('size', event.size.toString());
        }
      }

      // Handle page change
      if (event.page !== undefined && event.size === undefined) {
        if (event.page === DEFAULT_PAGE) {
          params.delete('page');
        } else {
          params.set('page', event.page.toString());
        }
      }

      return params;
    }, { replace: true });
  }, [setSearchParams, defaultSize]);

  // Reset pagination to defaults
  const resetPagination = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete('page');
      params.delete('size');
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  // Update totals from API response
  const setTotals = useCallback((elements: number, pages: number) => {
    setTotalElements(elements);
    setTotalPages(pages);
  }, []);

  return {
    page,
    size,
    totalElements,
    totalPages,
    paginationParams,
    serverPagination,
    onPaginate,
    setTotals,
    resetPagination,
  };
}
