import type { AppInfoState } from '@/hooks/useAppInfo';
import { strings } from '@/i18n';

/** Built on each render: the text depends on the active language. */
const variants = () =>
  ({
  checking: { dot: 'bg-ink-muted animate-pulse', text: strings.connection.checking },
  connected: { dot: 'bg-risk-safe', text: strings.connection.connected },
  'browser-only': { dot: 'bg-risk-warn', text: strings.connection.browserOnly },
  error: { dot: 'bg-risk-danger', text: strings.connection.error },
  }) as const;

export function ConnectionBadge({ state }: { state: AppInfoState }) {
  const variant = variants()[state.status];

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
