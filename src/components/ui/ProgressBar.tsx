import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  label: string;
  tone?: 'ink' | 'primary' | 'box';
  className?: string;
}

const TONES = { ink: 'bg-ink', primary: 'bg-primary', box: 'bg-box-ink' } as const;

export function ProgressBar({ value, label, tone = 'ink', className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className="tabular-nums">{clamped}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="h-1.5 overflow-hidden rounded-full bg-current/15"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500 ease-out-soft', TONES[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
