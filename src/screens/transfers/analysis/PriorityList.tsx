import { ArrowDown, ArrowUp, Check, RotateCcw } from 'lucide-react';
import type { FileCategory, PriorityDecision, PriorityPlan } from '@/bridge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KIND_ICONS } from '@/components/ui/DataBox';
import { IconButton } from '@/components/ui/IconButton';
import { es } from '@/i18n/es';
import { CATEGORY_BOX_KIND } from '../categories';
import { categoryName } from './describe';

const t = es.workspace.analysis.priority;

interface PriorityListProps {
  priority: PriorityPlan;
  disabled: boolean;
  onDecide: (decision: PriorityDecision) => void;
}

/** Packing order of the boxes; reordered with buttons so it works with keyboard and screen readers. */
export function PriorityList({ priority, disabled, onDecide }: PriorityListProps) {
  const changed = priority.order.some((category, index) => category !== priority.suggested[index]);

  const move = (index: number, offset: -1 | 1) => {
    const order: FileCategory[] = [...priority.order];
    [order[index], order[index + offset]] = [order[index + offset], order[index]];
    onDecide({ action: 'reorder', order });
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <ol className="flex min-h-0 flex-col gap-2 overflow-y-auto p-1">
        {priority.order.map((category, index) => {
          const Icon = KIND_ICONS[CATEGORY_BOX_KIND[category]];
          const name = categoryName(category);
          return (
            <li
              key={category}
              className="flex items-center gap-4 rounded-2xl bg-surface-raised p-3 shadow-soft ring-1 ring-line animate-[rise-in_250ms_var(--ease-out-soft)_both]"
            >
              <span className="w-6 text-center font-mono text-sm text-ink-muted">{index + 1}</span>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-box text-box-ink ring-1 ring-box-line">
                <Icon aria-hidden size={18} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">{name}</span>
                {priority.reasons[category] && (
                  <span className="text-sm text-ink-muted">{priority.reasons[category]}</span>
                )}
              </div>
              <div className="flex gap-1">
                <IconButton
                  icon={ArrowUp}
                  label={t.up(name)}
                  variant="ghost"
                  size="sm"
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                />
                <IconButton
                  icon={ArrowDown}
                  label={t.down(name)}
                  variant="ghost"
                  size="sm"
                  disabled={disabled || index === priority.order.length - 1}
                  onClick={() => move(index, 1)}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="flex flex-wrap items-center gap-2">
        <Badge tone={priority.status === 'pending' ? 'accent' : 'primary'}>{t.statuses[priority.status]}</Badge>
        <div className="ml-auto flex flex-wrap gap-2">
          {(changed || priority.status !== 'pending') && (
            <Button size="sm" variant="ghost" icon={RotateCcw} disabled={disabled} onClick={() => onDecide({ action: 'reset' })}>
              {t.reset}
            </Button>
          )}
          {priority.status === 'pending' && (
            <Button size="sm" icon={Check} disabled={disabled} onClick={() => onDecide({ action: 'accept' })}>
              {t.accept}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
