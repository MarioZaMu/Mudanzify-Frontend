import type { AppInfoState } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';

const VARIANTS = {
  checking: { dot: 'bg-stone-400 animate-pulse', text: es.setup.connection.checking },
  connected: { dot: 'bg-green-600', text: es.setup.connection.connected },
  'browser-only': { dot: 'bg-yellow-500', text: es.setup.connection.browserOnly },
  error: { dot: 'bg-red-600', text: es.setup.connection.error },
} as const;

export function ConnectionBadge({ state }: { state: AppInfoState }) {
  const variant = VARIANTS[state.status];

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-stone-200"
    >
      <span aria-hidden className={`size-2.5 rounded-full ${variant.dot}`} />
      {variant.text}
    </div>
  );
}
