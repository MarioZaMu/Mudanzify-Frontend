import { Info, ShieldAlert, ShieldCheck, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type AlertTone = 'info' | 'safe' | 'warn' | 'danger';

const TONES: Record<AlertTone, { icon: LucideIcon; className: string }> = {
  info: { icon: Info, className: 'bg-primary-soft text-primary-soft-ink' },
  safe: { icon: ShieldCheck, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  warn: { icon: TriangleAlert, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  danger: { icon: ShieldAlert, className: 'bg-risk-danger-soft text-risk-danger-ink' },
};

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Inline message; like the risk badge it pairs color with an icon and text. */
export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { icon: Icon, className: toneClass } = TONES[tone];

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-2xl px-4 py-3 text-sm', toneClass, className)}
    >
      <Icon aria-hidden size={18} strokeWidth={2.25} className="mt-0.5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
