import { CircleAlert, CircleCheck, CircleSlash, ExternalLink, FolderOpen, Lock, RotateCcw, type LucideIcon } from 'lucide-react';
import type { TransferDraft, TransferExecution } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatBytes, formatNumber } from '@/lib/format';
import { fileName } from '../analysis/describe';

const t = es.workspace.execution.report;

const HEADER: Record<TransferExecution['status'], { icon: LucideIcon; className: string }> = {
  running: { icon: CircleCheck, className: 'bg-primary-soft text-primary-soft-ink' },
  done: { icon: CircleCheck, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  cancelled: { icon: CircleSlash, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  failed: { icon: CircleAlert, className: 'bg-risk-danger-soft text-risk-danger-ink' },
};

interface ExecutionReportProps {
  draft: TransferDraft;
  execution: TransferExecution;
  busy: boolean;
  onOpenReport: () => void;
  onOpenFolder: () => void;
  onAgain: () => void;
}

/** What happened: totals, verification, problems and the saved HTML report. */
export function ExecutionReport({ draft, execution, busy, onOpenReport, onOpenFolder, onAgain }: ExecutionReportProps) {
  const { icon: Icon, className } = HEADER[execution.status];
  const failed = execution.results.filter((result) => result.status === 'failed');
  const pending = execution.results.filter((result) => result.status === 'pending').length;
  const verified = execution.results.filter((result) => result.status === 'copied' && result.verified).length;
  const totals = [
    { label: t.totals.copied, value: formatNumber(execution.totals.copied) },
    { label: t.totals.transformed, value: formatNumber(execution.totals.transformed) },
    { label: t.totals.skipped, value: formatNumber(execution.totals.skipped) },
    { label: t.totals.failed, value: formatNumber(execution.totals.failed) },
    { label: t.totals.bytes, value: formatBytes(execution.totals.bytes) },
  ];

  return (
    <div className="grid h-full min-h-0 gap-6 @3xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
      <Card as="section" className="flex min-h-0 flex-col gap-5">
        <header className="flex items-start gap-4">
          <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', className)}>
            <Icon aria-hidden size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-title">{t.titles[execution.status]}</h2>
            <p className="text-ink-muted">{t.bodies[execution.status]}</p>
          </div>
        </header>

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-3">
          {totals.map((total) => (
            <div key={total.label} className="flex flex-col gap-1 rounded-2xl bg-surface-sunken p-3">
              <dt className="text-xs text-ink-muted">{total.label}</dt>
              <dd className="text-xl font-semibold tabular-nums">{total.value}</dd>
            </div>
          ))}
        </dl>

        {verified > 0 && (
          <p className="flex items-center gap-2 text-sm text-risk-safe-ink">
            <CircleCheck aria-hidden size={16} />
            {t.verified(verified)}
          </p>
        )}
        {pending > 0 && <Alert tone="warn">{t.pendingFiles(pending)}</Alert>}

        <h3 className="font-semibold">{t.issues}</h3>
        {failed.length === 0 ? (
          <p className="text-sm text-ink-muted">{t.noIssues}</p>
        ) : (
          <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
            {failed.map((result) => (
              <li key={result.fileId} className="flex items-start gap-3 rounded-2xl bg-risk-danger-soft p-3 text-sm">
                <CircleAlert aria-hidden size={16} className="mt-0.5 shrink-0 text-risk-danger-ink" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{fileName(draft.inventory!, result.fileId)}</span>
                  <span className="text-risk-danger-ink">{result.error}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card variant="sunken" className="flex min-h-0 flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-ink-muted">{es.workspace.execution.panels.destination}</span>
          <span className="font-mono text-sm break-all">{execution.outputPath}</span>
        </div>
        {!execution.reportPath && <Alert tone="warn">{t.noReport}</Alert>}
        <div className="flex flex-wrap gap-2">
          {execution.reportPath && (
            <Button icon={ExternalLink} onClick={onOpenReport}>
              {t.openReport}
            </Button>
          )}
          <Button variant="outline" icon={FolderOpen} onClick={onOpenFolder}>
            {t.openFolder}
          </Button>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <p className="font-semibold">{t.next}</p>
          <Badge icon={Lock} tone="inverse" className="w-fit">
            {t.soon}
          </Badge>
          <Button variant="ghost" icon={RotateCcw} disabled={busy} className="self-start" onClick={onAgain}>
            {t.again}
          </Button>
        </div>
      </Card>
    </div>
  );
}
