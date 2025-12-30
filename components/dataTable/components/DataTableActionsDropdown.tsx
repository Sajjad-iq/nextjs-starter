import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ActionItem<TData = any> {
  /** Icon component to display */
  icon: LucideIcon;
  /** Label text for the action */
  label: string;
  /** Callback function when action is clicked */
  onClick: (data: TData) => void;
  /** Optional: Makes this action destructive (red text) */
  destructive?: boolean;
  /** Optional: Show this action conditionally */
  show?: boolean | ((data: TData) => boolean);
}

export interface ActionGroup<TData = any> {
  /** Actions in this group */
  actions: ActionItem<TData>[];
  /** Optional: Show separator after this group */
  separator?: boolean;
}

interface DataTableActionsDropdownProps<TData = any> {
  /** The data item for this row/card */
  data: TData;
  /** Array of action groups or single actions */
  actions: (ActionItem<TData> | ActionGroup<TData>)[];
  /** Optional: Custom button variant */
  buttonVariant?: 'ghost' | 'outline' | 'default' | 'secondary';
  /** Optional: Custom button size */
  buttonSize?: 'sm' | 'default' | 'lg';
  /** Optional: Grid columns (default: auto-fit) */
  gridCols?: 1 | 2 | 3 | 4;
}

/**
 * DataTableActionsDropdown Component (Now a Button Grid)
 *
 * Generic actions grid for DataTable rows and cards.
 * Supports:
 * - Multiple action items with icons and labels
 * - Action groups with separators
 * - Conditional action display
 * - Destructive actions (red variant)
 * - Responsive grid layout
 *
 * @example
 * ```tsx
 * <DataTableActionsDropdown
 *   data={currency}
 *   actions={[
 *     {
 *       actions: [
 *         { icon: Pencil, label: 'Edit', onClick: handleEdit },
 *         {
 *           icon: CheckCircle,
 *           label: 'Activate',
 *           onClick: handleActivate,
 *           show: (data) => !data.active
 *         },
 *       ],
 *       separator: true
 *     },
 *     {
 *       actions: [
 *         {
 *           icon: Trash2,
 *           label: 'Delete',
 *           onClick: handleDelete,
 *           destructive: true
 *         }
 *       ]
 *     }
 *   ]}
 *   gridCols={2}
 * />
 * ```
 */
export function DataTableActionsDropdown<TData = any>({
  data,
  actions,
  buttonVariant = 'outline',
  buttonSize = 'sm',
  gridCols,
}: DataTableActionsDropdownProps<TData>) {
  // Helper to check if action should be shown
  const shouldShowAction = (action: ActionItem<TData>): boolean => {
    if (action.show === undefined) return true;
    if (typeof action.show === 'boolean') return action.show;
    return action.show(data);
  };

  // Normalize actions to always be groups
  const normalizedGroups: ActionGroup<TData>[] = actions.map((item) => {
    if ('actions' in item) {
      return item as ActionGroup<TData>;
    }
    return { actions: [item as ActionItem<TData>], separator: false };
  });

  // Filter out groups with no visible actions
  const visibleGroups = normalizedGroups
    .map((group) => ({
      ...group,
      actions: group.actions.filter(shouldShowAction),
    }))
    .filter((group) => group.actions.length > 0);

  // If no actions are visible, don't render anything
  if (visibleGroups.length === 0) {
    return null;
  }

  // Flatten all actions into a single array
  const allActions = visibleGroups.flatMap((group) => group.actions);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 min-w-[250px]">
        {allActions.map((action, actionIndex) => {
          const Icon = action.icon;
          return (
            <Tooltip key={actionIndex}>
              <TooltipTrigger asChild>
                <Button
                  variant={action.destructive ? 'destructive' : buttonVariant}
                  size="icon"
                  onClick={() => action.onClick(data)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
