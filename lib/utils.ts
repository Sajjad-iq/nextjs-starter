import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats date strings for display
 * @param dateString - ISO date string to format
 * @returns Formatted date string or 'N/A' if invalid
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Handle updater function or direct value (React Hook Form pattern)
 */
export function valueUpdater<T>(
  updaterOrValue: T | ((old: T) => T),
  currentValue: T
): T {
  return typeof updaterOrValue === 'function'
    ? (updaterOrValue as (old: T) => T)(currentValue)
    : updaterOrValue;
}

export function formatNumber(
  value: number | null | undefined,
  decimals = 0
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  if (!isFinite(value)) {
    return '—';
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a price/amount as a whole number with currency
 * @param value - The numeric value to format
 * @param currency - Currency suffix (default: 'IQD')
 * @returns Formatted price string without decimals
 */
export function formatPrice(
  value: number | null | undefined,
  currency: string = 'IQD'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return `0 ${currency}`;
  }
  return `${Math.round(value).toLocaleString()} ${currency}`;
}

/**
 * Format a percentage as a whole number
 * @param value - The percentage value to format
 * @returns Formatted percentage string without decimals
 */
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Math.round(value)}%`;
}
