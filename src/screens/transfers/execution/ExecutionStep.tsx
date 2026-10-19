import { Play, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ExecutionPlan, ExecutionProgress, TransferDraft } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { es } from '@/i18n/es';
import { formatBytes } from '@/lib/format';
import { ExecutionReport } from './ExecutionReport';
import { DestinationPanel, OriginPanel, PlanPanel } from './PlanPanels';

const t = es.workspace.execution;

interface ExecutionStepProps {
  draft: TransferDraft;
  plan: ExecutionPlan | null;
  planFailed: boolean;
  running: boolean;
  busy: boolean;
  progress: ExecutionProgress | null;
  onPreview: () => void;
  onStart: () => void;
  onCancel: () => void;
  onOpenReport: () => void;
  onOpenFolder: () => void;
  onAgain: () => void;
}

/** Step 6: origin, plan and destination side by side; then the copy and its report. */
export function ExecutionStep(props: ExecutionStepProps) {
  const { draft, plan, planFailed, running, busy, progress, onPreview } = props;
  const [dialog, setDialog] = useState<'start' | 'cancel' | 'again' | null>(null);
  const execution = draft.execution;
  const showReport = execution !== null && execution.status !== 'running' && !running;

  // The plan is computed by the backend from the confirmed review each time the view opens.
  useEffect(() => {
    if (!showReport) onPreview();
  }, [showReport, draft.analysis?.analyzedAt]);

  if (showReport) {
    return (
      <>
        <ExecutionReport
          draft={draft}
          execution={execution}
          busy={busy}
          onOpenReport={props.onOpenReport}
          onOpenFolder={props.onOpenFolder}
          onAgain={() => setDialog('again')}
        />
        <ConfirmDialog
          open={dialog === 'again'}
          title={t.report.againTitle}
          description={t.report.againBody}
          confirmLabel={t.report.again}
          onConfirm={() => {
            props.onAgain();
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      </>
    );
  }

  if (!plan) {
    return planFailed ? <Alert tone="danger">{t.planError}</Alert> : <p className="text-ink-muted">{t.loading}</p>;
  }

  const percent = progress && progress.bytesTotal > 0 ? (progress.bytesDone / progress.bytesTotal) * 100 : progress && progress.total > 0 ? (progress.done / progress.total) * 100 : 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid min-h-0 flex-1 gap-4 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,3fr)]">
        <OriginPanel draft={draft} />
        <PlanPanel draft={draft} plan={plan} done={running ? (progress?.done ?? 0) : null} />
        <DestinationPanel draft={draft} plan={plan} />
      </div>

      <footer className="flex flex-wrap items-center gap-4 rounded-card bg-surface-inverse p-4 text-ink-inverse animate-[rise-in_300ms_var(--ease-out-soft)_both]">
        {running ? (
          <>
            <div role="status" aria-live="polite" className="flex min-w-0 flex-1 flex-col gap-1">
              <ProgressBar
                value={percent}
                tone="primary"
                label={progress ? `${t.running.title} ${t.running.files(progress.done, progress.total)}` : t.running.title}
              />
              {progress?.current && (
                <span className="truncate font-mono text-xs opacity-75" title={progress.current}>
                  {progress.current}
                </span>
              )}
            </div>
            <Button variant="outline" icon={Square} onClick={() => setDialog('cancel')}>
              {t.running.cancel}
            </Button>
          </>
        ) : (
          <>
            <p className="min-w-0 flex-1 text-sm">
              {t.summary(plan.totals.copy, plan.totals.transform, plan.totals.skip, formatBytes(plan.totals.bytes))}
            </p>
            <Button icon={Play} disabled={busy || plan.totals.copy + plan.totals.transform === 0} onClick={() => setDialog('start')}>
              {t.start}
            </Button>
          </>
        )}
      </footer>

      <ConfirmDialog
        open={dialog === 'start'}
        title={t.confirmTitle}
        description={t.confirmBody(plan.outputName)}
        confirmLabel={t.start}
        onConfirm={() => {
          setDialog(null);
          props.onStart();
        }}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'cancel'}
        title={t.running.cancelTitle}
        description={t.running.cancelBody}
        confirmLabel={t.running.cancelConfirm}
        onConfirm={() => {
          setDialog(null);
          props.onCancel();
        }}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}
