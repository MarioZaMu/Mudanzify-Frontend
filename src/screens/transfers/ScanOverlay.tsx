import { PackageSearch } from 'lucide-react';
import type { ScanProgress } from '@/bridge';
import { es } from '@/i18n/es';
import { formatBytes, formatNumber } from '@/lib/format';

const t = es.workspace.scanning;

/** Covers the workspace while the backend reads the sources. */
export function ScanOverlay({ progress }: { progress: ScanProgress | null }) {
  const phase = progress?.phase ?? 'walking';

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-panel bg-surface/70 backdrop-blur-md animate-[rise-in_300ms_var(--ease-out-soft)_both]">
      <div role="status" aria-live="polite" className="flex w-[min(26rem,90%)] flex-col items-center gap-6 text-center">
        <div className="relative grid size-28 place-items-center overflow-hidden rounded-[2rem] bg-box text-box-ink shadow-lifted ring-1 ring-box-line">
          <PackageSearch aria-hidden size={44} />
          <span className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_16px_4px] shadow-primary/40 animate-[scan_1.6s_ease-in-out_infinite_alternate]" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-title">{t.title}</h2>
          <p className="font-medium">{t[phase]}</p>
          <p className="text-sm text-ink-muted tabular-nums">
            {t.files(formatNumber(progress?.filesSeen ?? 0))} · {formatBytes(progress?.bytesSeen ?? 0)}
          </p>
          {progress?.currentPath && (
            <p className="truncate font-mono text-xs text-ink-muted" title={progress.currentPath}>
              {progress.currentPath}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
