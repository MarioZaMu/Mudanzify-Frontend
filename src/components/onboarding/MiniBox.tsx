import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

interface MiniBoxProps {
  icon: LucideIcon;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Small decorative cardboard box used in the onboarding illustrations. */
export function MiniBox({ icon: Icon, label, className, style }: MiniBoxProps) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 rounded-3xl bg-box text-box-ink shadow-lifted ring-1 ring-box-line',
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 mx-auto h-3 w-1/3 rounded-b-md bg-box-tape/70" />
      <Icon size={28} strokeWidth={1.75} />
      {label && <span className="text-sm font-semibold">{label}</span>}
    </div>
  );
}
