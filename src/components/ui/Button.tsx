import { LoaderCircle, type LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-ink shadow-soft hover:bg-primary-hover',
  secondary: 'bg-surface-inverse text-ink-inverse shadow-soft hover:opacity-90',
  outline: 'bg-surface-raised text-ink ring-1 ring-line-strong ring-inset hover:bg-surface-sunken',
  ghost: 'text-ink hover:bg-surface-sunken',
  danger: 'bg-risk-danger text-white shadow-soft hover:brightness-95 dark:text-graphite',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-4 text-sm',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-13 gap-2.5 px-7 text-base',
};

const ICON_SIZES: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'start',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const iconNode = loading ? (
    <LoaderCircle aria-hidden size={ICON_SIZES[size]} className="animate-spin" />
  ) : (
    Icon && <Icon aria-hidden size={ICON_SIZES[size]} strokeWidth={2} />
  );

  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap',
        'transition-[background-color,opacity,transform,filter] duration-150 ease-out-soft active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {iconPosition === 'start' && iconNode}
      {children}
      {iconPosition === 'end' && iconNode}
    </button>
  );
}
