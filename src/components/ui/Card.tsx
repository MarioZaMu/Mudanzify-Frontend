import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: 'raised' | 'glass' | 'inverse' | 'sunken';
  as?: 'section' | 'article' | 'div';
}

const VARIANTS = {
  raised: 'bg-surface-raised shadow-soft ring-1 ring-line',
  glass: 'glass shadow-soft',
  inverse: 'bg-surface-inverse text-ink-inverse',
  sunken: 'bg-surface-sunken',
} as const;

export function Card({ variant = 'raised', as: Tag = 'section', className, ...props }: CardProps) {
  return <Tag className={cn('rounded-card p-6', VARIANTS[variant], className)} {...props} />;
}

export function CardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex flex-col gap-1">
      <h2 className="text-title">{title}</h2>
      {description && <p className="max-w-prose text-ink-muted">{description}</p>}
    </header>
  );
}
