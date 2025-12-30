import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { ErrorHandler } from '@/utils/errorHandler';

const DEFAULT_PAGE_SIZE = 20;

/**
 * HTTP Service - Singleton pattern for Axios configuration
 *
 * Features:
 * - HTTP-only cookie-based authentication
 * - Automatic X-Organization-ID header injection
 * - Automatic pagination params from URL (page, size) for GET requests
 * - Automatic 401 error handling
 * - Global error toast notifications using ErrorHandler
 * - Request/Response interceptors
 * - Configurable base URL from environment
 */
class HttpService {
  private axiosInstance: AxiosInstance;
  private unauthorizedCallback: (() => void) | null = null;
  private isRedirecting = false;

  constructor() {
    // Get base URL from environment or use default
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083/api';

    // Create Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true, // CRITICAL: Send HTTP-only cookies with every request
      headers: {
        'Accept-Language': 'ar-IQ', // Default language header
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // No manual token handling - cookies are automatically sent

        // Add X-Organization-ID header if organization is selected and not auth endpoint
        const isAuthEndpoint = config.url?.includes('/auth/');
        if (!isAuthEndpoint) {
          const selectedOrgId = localStorage.getItem('selected_organization_id');
          if (selectedOrgId) {
            config.headers['X-Organization-ID'] = selectedOrgId;
          }
        }

        // Auto-attach pagination params from URL for GET requests
        if (config.method?.toLowerCase() === 'get') {
          this.attachPaginationParams(config);
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Reset redirecting flag on successful response
        this.isRedirecting = false;
        return response;
      },
      (error: AxiosError) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          if (!this.isRedirecting) {
            const isAuthOperation = error.config?.url?.includes('/auth/validate-token');

            if (isAuthOperation && this.unauthorizedCallback && !window.location.pathname.startsWith("/auth")) {
              this.isRedirecting = true;
              this.unauthorizedCallback();
              // Reset flag after a delay to allow for re-login
              setTimeout(() => {
                this.isRedirecting = false;
              }, 1000);
            }
          }
        }

        // Global error toast handling using ErrorHandler
        // Extract and format error message from backend response

        const apiError = ErrorHandler.handleApiError(error);
        const errorMessage = ErrorHandler.getErrorMessage(apiError);

        if (errorMessage) {
          toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Attach pagination params from browser URL to the request
   * Only adds params if not already present in the request URL
   */
  private attachPaginationParams(config: InternalAxiosRequestConfig): void {
    // Skip if URL already has pagination params
    if (config.url?.includes('page=') || config.url?.includes('size=')) {
      return;
    }

    // Skip auth endpoints and specific non-paginated endpoints
    const skipEndpoints = ['/auth/', '/media/', '/upload'];
    if (skipEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      return;
    }

    // Get pagination from browser URL
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const size = urlParams.get('size');

    // Build params object
    const params = config.params || {};

    // Only add pagination if at least one param exists in URL or use defaults for list endpoints
    if (page !== null || size !== null) {
      params.page = page !== null ? parseInt(page, 10) : 0;
      params.size = size !== null ? parseInt(size, 10) : DEFAULT_PAGE_SIZE;
      config.params = params;
    }
  }

  /**
   * Register callback to handle unauthorized (401) errors
   * Called by App component to handle session expiry
   */
  setUnauthorizedCallback(callback: () => void): void {
    this.unauthorizedCallback = callback;
  }

  /**
   * Get the configured Axios instance for making API calls
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Reset the redirecting flag (used after successful re-authentication)
   */
  resetRedirectingFlag(): void {
    this.isRedirecting = false;
  }
}

// Export singleton instance
export const httpService = new HttpService();
