import { useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  label: string;
  /** Prefix for the ids used to link each tab with its panel. */
  idPrefix: string;
}

/** Segmented tab list (like "Día / Semana / Mes") with roving focus and arrow keys. */
export function Tabs({ items, activeId, onChange, label, idPrefix }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = (index: number) => {
    const next = items[(index + items.length) % items.length];
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#${idPrefix}-tab-${next.id}`)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === activeId);
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    event.stopPropagation();
    focusTab(moves[event.key]);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="flex w-fit flex-wrap gap-1 rounded-full bg-surface-sunken p-1"
    >
      {items.map(({ id, label: tabLabel }) => {
        const selected = id === activeId;
        return (
          <button
            key={id}
            id={`${idPrefix}-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={cn(
              'h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow] duration-200',
              selected ? 'bg-surface-raised text-ink shadow-soft' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tabLabel}
          </button>
        );
      })}
    </div>
  );
}
