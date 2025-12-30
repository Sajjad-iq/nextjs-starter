import { create } from 'zustand';
import type { User } from '@/types/global';

interface AuthState {
  // State
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean

  // Computed
  isAuthenticated: () => boolean;

  // Actions
  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  clearSession: () => void;
}

/**
 * Auth Store - Manages authentication state
 *
 * Stores:
 * - Current user
 * - Selected organization
 * - Initialization status
 *
 * Note: Token is stored in HTTP-only cookie (not in this store)
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isInitialized: false,
  isLoading: false,

  // Computed getters
  isAuthenticated: () => {
    return get().user !== null;
  },

  setIsLoading: (value) => {
    set({ isLoading: value });
  },

  // Actions
  setUser: (user) => {
    set({ user });
  },


  setInitialized: (value) => {
    set({ isInitialized: value });
  },

  clearSession: () => {
    set({
      user: null,
      isInitialized: false,
    });
  },
}));
