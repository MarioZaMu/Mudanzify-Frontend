import { ScanSearch } from 'lucide-react';
import type { AnalysisProgress } from '@/bridge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { es } from '@/i18n/es';

const t = es.workspace.analysis.running;
const PHASES: AnalysisProgress['phase'][] = ['hashing', 'tables', 'ai'];

/** Covers the workspace while the files are checked locally and the AI prepares its suggestions. */
export function AnalysisOverlay({ progress }: { progress: AnalysisProgress | null }) {
  const phase = progress?.phase ?? 'hashing';
  // Each phase is a third of the bar, so it never goes backwards.
  const share = progress && progress.total > 0 ? progress.done / progress.total : 0;
  const value = ((PHASES.indexOf(phase) + share) / PHASES.length) * 100;

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-panel bg-surface/70 backdrop-blur-md animate-[rise-in_300ms_var(--ease-out-soft)_both]">
      <div role="status" aria-live="polite" className="flex w-[min(26rem,90%)] flex-col items-center gap-6 text-center">
        <div className="relative grid size-28 place-items-center overflow-hidden rounded-[2rem] bg-primary text-primary-ink shadow-lifted">
          <ScanSearch aria-hidden size={44} />
          <span className="absolute inset-x-0 h-0.5 bg-primary-ink/80 shadow-[0_0_16px_4px] shadow-primary-ink/40 animate-[scan_1.6s_ease-in-out_infinite_alternate]" />
        </div>
        <div className="flex w-full flex-col gap-3">
          <h2 className="text-title">{t.title}</h2>
          <p className="font-medium">{t[phase]}</p>
          <ProgressBar value={value} label={t.progress} tone="primary" />
        </div>
      </div>
    </div>
  );
}
