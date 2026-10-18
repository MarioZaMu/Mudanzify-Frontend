import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  /** Accessible name, also shown as a tooltip. Required: there is no visible text. */
  label: string;
  variant?: 'inverse' | 'outline' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  inverse: 'bg-surface-inverse text-ink-inverse hover:opacity-90',
  outline: 'bg-surface-raised text-ink ring-1 ring-line ring-inset hover:bg-surface-sunken',
  ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
  primary: 'bg-primary text-primary-ink hover:bg-primary-hover',
} as const;

const SIZES = { sm: 'size-9', md: 'size-11', lg: 'size-13' } as const;
const ICON_SIZES = { sm: 16, md: 18, lg: 20 } as const;

export function IconButton({
  icon: Icon,
  label,
  variant = 'outline',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid shrink-0 cursor-pointer place-items-center rounded-full',
        'transition-[background-color,opacity,transform] duration-150 ease-out-soft active:scale-95',
        'disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden size={ICON_SIZES[size]} strokeWidth={2} />
    </button>
  );
}
