import type { AppInfoState } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';

const VARIANTS = {
  checking: { dot: 'bg-ink-muted animate-pulse', text: es.connection.checking },
  connected: { dot: 'bg-risk-safe', text: es.connection.connected },
  'browser-only': { dot: 'bg-risk-warn', text: es.connection.browserOnly },
  error: { dot: 'bg-risk-danger', text: es.connection.error },
} as const;

export function ConnectionBadge({ state }: { state: AppInfoState }) {
  const variant = VARIANTS[state.status];

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex h-11 w-fit items-center gap-2.5 rounded-full bg-surface-raised px-4 text-sm font-medium shadow-soft ring-1 ring-line"
    >
      <span aria-hidden className={`size-2.5 rounded-full ${variant.dot}`} />
      {variant.text}
    </div>
  );
}
