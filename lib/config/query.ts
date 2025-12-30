import { QueryClient } from '@tanstack/react-query';

// Cache duration constants
const STALE_TIME = 3 * 60 * 1000; // 3 minutes - data considered fresh
const GC_TIME = 5 * 60 * 1000; // 5 minutes - garbage collection time

/**
 * TanStack Query Client Configuration
 *
 * Settings optimized for the application:
 * - 3 minute stale time (TTL - data considered fresh)
 * - 5 minute garbage collection time
 * - 2 retries for failed queries
 * - No automatic refetching (manual control)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Query Key Factories
 * Centralized query keys for consistency and type safety
 */
export const queryKeys = {

  // Items
  items: {
    all: ['items'] as const,
    lists: () => [...queryKeys.items.all, 'list'] as const,
    list: (organizationId: string, page: number, size: number, activeOnly = false) =>
      [...queryKeys.items.lists(), organizationId, page, size, activeOnly] as const,
    details: () => [...queryKeys.items.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.items.details(), id] as const,
    withSetup: (id: string) => [...queryKeys.items.details(), id, 'setup'] as const,
  },

  // Stock
  stock: {
    all: ['stock'] as const,
    lists: () => [...queryKeys.stock.all, 'list'] as const,
    list: (itemId: string, page: number, size: number) =>
      [...queryKeys.stock.lists(), itemId, page, size] as const,
    details: () => [...queryKeys.stock.all, 'detail'] as const,
    detail: (itemId: string, stockId: string) => [...queryKeys.stock.details(), itemId, stockId] as const,
  },
};

/**
 * Query Utility Functions
 */
export const queryUtils = {

  /**
 * Clear all queries (used on logout)
   */
  clearAll: () => {
    queryClient.clear();
  },

  /**
   * Reset all queries (refetch all active queries)
   */
  resetAll: () => {
    queryClient.resetQueries();
  },

  /**
   * Invalidate all items queries
   */
  invalidateItems: () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.items.all,
    });
  },

  /**
   * Invalidate items list for an organization
   */
  invalidateItemsList: (organizationId: string) => {
    return queryClient.invalidateQueries({
      queryKey: [...queryKeys.items.lists(), organizationId],
    });
  },

  /**
   * Invalidate all stock queries for an item
   */
  invalidateStock: (itemId: string) => {
    return queryClient.invalidateQueries({
      queryKey: [...queryKeys.stock.lists(), itemId],
    });
  },
};
