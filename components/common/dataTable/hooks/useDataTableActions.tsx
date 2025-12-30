import { useMemo } from 'react';
import type { ActionGroup, ActionItem } from '../components/DataTableActionsDropdown';

/**
 * Hook to create and memoize DataTable actions
 *
 * @example
 * ```tsx
 * const actions = useDataTableActions<CurrencyResponse>([
 *   {
 *     actions: [
 *       { icon: Pencil, label: t('edit'), onClick: handleEdit },
 *       { icon: Trash2, label: t('delete'), onClick: handleDelete, destructive: true }
 *     ]
 *   }
 * ], [handleEdit, handleDelete, t]);
 * ```
 */
export function useDataTableActions<TData>(
  actions: (ActionItem<TData> | ActionGroup<TData>)[],
  deps: any[] = []
): (ActionItem<TData> | ActionGroup<TData>)[] {
  return useMemo(() => actions, deps);
}
