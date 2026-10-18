import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  tone?: 'neutral' | 'primary' | 'accent' | 'inverse';
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const TONES = {
  neutral: 'bg-surface-sunken text-ink-muted',
  primary: 'bg-primary-soft text-primary-soft-ink',
  accent: 'bg-accent text-accent-ink',
  inverse: 'bg-surface-inverse text-ink-inverse',
} as const;

export function Badge({ tone = 'neutral', icon: Icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      {Icon && <Icon aria-hidden size={14} strokeWidth={2.25} />}
      {children}
    </span>
  );
}
