import type { LucideIcon } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footer?: React.ReactNode;
}

/** Height of a nav item (h-11) plus the list gap (gap-1), in px. */
const ITEM_STRIDE = 48;

export function Sidebar({ items, activeId, onSelect, footer }: SidebarProps) {
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));

  return (
    <aside className="glass flex w-60 shrink-0 flex-col gap-8 rounded-panel p-5">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <nav aria-label={es.nav.label} className="flex-1">
        <ul className="relative flex flex-col gap-1">
          {/* Active pill that slides between items instead of jumping. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-11 rounded-full bg-surface-inverse shadow-soft transition-transform duration-300 ease-out-soft"
            style={{ transform: `translateY(${activeIndex * ITEM_STRIDE}px)` }}
          />
          {items.map(({ id, label, icon: Icon }) => {
            const active = id === activeId;
            return (
              <li key={id} className="relative">
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex h-11 w-full cursor-pointer items-center gap-3 rounded-full px-4 text-left text-sm font-medium',
                    'transition-colors duration-200',
                    active ? 'text-ink-inverse' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                  )}
                >
                  <Icon aria-hidden size={18} strokeWidth={active ? 2.25 : 1.75} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-4">
        <ThemeToggle />
        {footer}
      </div>
    </aside>
  );
}
