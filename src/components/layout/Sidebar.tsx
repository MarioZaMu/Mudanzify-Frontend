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
  footer?: React.ReactNode;
}

export function Sidebar({ items, activeId, footer }: SidebarProps) {
  return (
    <aside className="glass flex w-60 shrink-0 flex-col gap-8 rounded-panel p-5">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <nav aria-label={es.nav.label} className="flex-1">
        <ul className="flex flex-col gap-1">
          {items.map(({ id, label, icon: Icon }) => {
            const active = id === activeId;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'flex h-11 items-center gap-3 rounded-full px-4 text-sm font-medium',
                    'transition-colors duration-150',
                    active
                      ? 'bg-surface-inverse text-ink-inverse shadow-soft'
                      : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
                  )}
                >
                  <Icon aria-hidden size={18} strokeWidth={active ? 2.25 : 1.75} />
                  {label}
                </a>
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
