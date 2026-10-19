import { ArrowRight, CircleAlert, CircleCheck, CircleSlash, ExternalLink, FolderOpen, type LucideIcon } from 'lucide-react';
import type { ExecutionStatus, Reception, TableChange } from '@/bridge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataBox } from '@/components/ui/DataBox';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatBytes, formatDate } from '@/lib/format';
import { categoryName } from '../transfers/analysis/describe';
import { CATEGORY_BOX_KIND } from '../transfers/categories';

const t = es.receptions.received;
const c = es.receptions.confirm;

const SEND_STATUS: Record<ExecutionStatus, { icon: LucideIcon; className: string }> = {
  running: { icon: CircleAlert, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  done: { icon: CircleCheck, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  cancelled: { icon: CircleSlash, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  failed: { icon: CircleAlert, className: 'bg-risk-danger-soft text-risk-danger-ink' },
};

export function describeChange(change: TableChange): string {
  switch (change.kind) {
    case 'mask':
      return t.changes.mask(change.column);
    case 'drop-column':
      return t.changes['drop-column'](change.column);
    case 'remove-duplicates':
      return t.changes['remove-duplicates'](change.rows);
    case 'rename':
      return t.changes.rename(change.to);
  }
}

interface ReceivedStepProps {
  reception: Reception;
  onOpenReport: () => void;
  onOpenFolder: () => void;
  onNext: () => void;
}

/** What the sender packed, read from the manifest; nothing is checked yet. */
export function ReceivedStep({ reception, onOpenReport, onOpenFolder, onNext }: ReceivedStepProps) {
  const status = SEND_STATUS[reception.sendStatus];
  const StatusIcon = status.icon;
  const changed = reception.files.filter((file) => file.changes.length > 0);

  return (
    <div className="grid h-full min-h-0 gap-6 @3xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
      <Card as="section" className="flex min-h-0 flex-col gap-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-title">{t.boxes}</h2>
            <p className="text-sm text-ink-muted">
              {reception.folderName} · {t.sent(formatDate(reception.sentAt))}
            </p>
          </div>
          <span
            className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold', status.className)}
          >
            <StatusIcon aria-hidden size={14} />
            {t.sendStatus[reception.sendStatus]}
          </span>
        </header>

        <ul className="grid min-h-0 auto-rows-min gap-3 overflow-y-auto p-1 sm:grid-cols-2 xl:grid-cols-3">
          {reception.boxes.map((box, index) => (
            <li key={box.category}>
              <DataBox
                code={String(index + 1).padStart(2, '0')}
                name={categoryName(box.category)}
                kind={CATEGORY_BOX_KIND[box.category]}
                status="delivered"
                compact
                itemCount={box.files}
                sizeLabel={formatBytes(box.bytes)}
                note={reception.verifiedAt ? (box.issues > 0 ? c.issues(box.issues) : c.noIssues) : c.notVerified}
              />
            </li>
          ))}
        </ul>

        {reception.skipped.length > 0 && (
          <p className="rounded-2xl bg-surface-sunken px-4 py-3 text-sm">
            <span className="font-medium">{t.skipped(reception.skipped.length)}.</span>{' '}
            <span className="text-ink-muted">{t.skippedHint}</span>
          </p>
        )}
      </Card>

      <Card variant="sunken" className="flex min-h-0 flex-col gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold">{t.criteria}</h3>
            {reception.criteria.length === 0 ? (
              <p className="text-sm text-ink-muted">{t.noCriteria}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {reception.criteria.map((criterion) => (
                  <li key={criterion.title} className="rounded-2xl bg-surface-raised p-3 text-sm">
                    <p className="font-medium">{criterion.title}</p>
                    {criterion.detail && <p className="text-ink-muted">{criterion.detail}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {changed.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold">{t.changesTitle}</h3>
              <ul className="flex flex-col gap-2">
                {changed.map((file) => (
                  <li key={file.path} className="rounded-2xl bg-surface-raised p-3 text-sm">
                    <p className="truncate font-medium">{file.path}</p>
                    <ul className="text-ink-muted">
                      {file.changes.map((change, index) => (
                        <li key={index}>{describeChange(change)}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {reception.notes.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold">{t.notes}</h3>
              <ul className="flex flex-col gap-2">
                {reception.notes.map((note) => (
                  <li key={`${note.path}:${note.column}`} className="rounded-2xl bg-risk-warn-soft p-3 text-sm text-risk-warn-ink">
                    <p className="truncate font-medium">{note.path}</p>
                    <p>{t.noteLine(note.column, note.empty, note.total)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {reception.hasReport && (
            <Button variant="outline" icon={ExternalLink} onClick={onOpenReport}>
              {t.openReport}
            </Button>
          )}
          <Button variant="outline" icon={FolderOpen} onClick={onOpenFolder}>
            {t.openFolder}
          </Button>
        </div>
        <Button icon={ArrowRight} iconPosition="end" className="self-start" onClick={onNext}>
          {t.next}
        </Button>
      </Card>
    </div>
  );
}
