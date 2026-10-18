import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

/** Mudanzify mark: a closed moving box with a strip of tape. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-8', className)}>
      <rect width="32" height="32" rx="10" className="fill-surface-inverse" />
      <path d="M8 12.5 16 9l8 3.5v8.5L16 24.5 8 21z" className="fill-kraft-400" />
      <path d="M8 12.5 16 16l8-3.5" className="fill-none stroke-kraft-700" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 16v8.5" className="stroke-kraft-700" strokeWidth="1.2" />
      <path d="M12 10.75 20 14.25v3" className="fill-none stroke-kraft-100" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight">{es.app.name}</span>
    </span>
  );
}
