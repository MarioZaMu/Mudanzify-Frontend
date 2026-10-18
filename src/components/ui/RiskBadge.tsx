import { ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

export type RiskLevel = 'safe' | 'warn' | 'danger';

const LEVELS = {
  safe: { icon: ShieldCheck, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  warn: { icon: TriangleAlert, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  danger: { icon: ShieldAlert, className: 'bg-risk-danger-soft text-risk-danger-ink' },
} as const;

/**
 * Risk traffic light label. Never relies on color alone:
 * it always pairs the color with an icon and a text label.
 */
export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const { icon: Icon, className: tone } = LEVELS[level];
  const { label, description } = es.risk[level];

  return (
    <span
      title={description}
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold whitespace-nowrap',
        tone,
        className,
      )}
    >
      <Icon aria-hidden size={14} strokeWidth={2.25} />
      {label}
    </span>
  );
}

const LIGHT_ORDER: RiskLevel[] = ['danger', 'warn', 'safe'];
const LIGHT_ON = { safe: 'bg-risk-safe', warn: 'bg-risk-warn', danger: 'bg-risk-danger' } as const;

/** Decorative three-light semaphore; pair it with a RiskBadge for the meaning. */
export function RiskLight({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span aria-hidden className={cn('inline-flex flex-col gap-1 rounded-full bg-graphite p-1.5 ring-1 ring-white/10', className)}>
      {LIGHT_ORDER.map((light) => (
        <span
          key={light}
          className={cn(
            'size-2 rounded-full transition-colors duration-300',
            light === level ? LIGHT_ON[light] : 'bg-white/15',
          )}
        />
      ))}
    </span>
  );
}
