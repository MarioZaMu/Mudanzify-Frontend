import { CircleAlert, CircleCheck, ExternalLink, MessageSquareWarning, PackageCheck, RotateCcw, Save, Undo2, X } from 'lucide-react';
import { useId, useState } from 'react';
import type { BoxReview, FileCategory, Reception, ReceptionBox } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatBytes, formatDate } from '@/lib/format';
import { categoryName } from '../transfers/analysis/describe';

const t = es.receptions.confirm;

interface ConfirmStepProps {
  reception: Reception;
  busy: boolean;
  onReview: (category: FileCategory, review: BoxReview) => void;
  onConfirm: () => void;
  onReopen: () => void;
  onOpenReceipt: () => void;
}

/** Box by box: accept it or report a problem; then confirm and leave a receipt in the folder. */
export function ConfirmStep({ reception, busy, onReview, onConfirm, onReopen, onOpenReceipt }: ConfirmStepProps) {
  const [asking, setAsking] = useState(false);

  if (reception.confirmedAt) {
    return <ConfirmedView reception={reception} busy={busy} onReopen={onReopen} onOpenReceipt={onOpenReceipt} />;
  }

  const pending = reception.boxes.filter((box) => box.decision === 'pending').length;

  return (
    <Card as="section" className="flex h-full min-h-0 flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h2 className="text-title">{t.title}</h2>
        <p className="text-ink-muted">{t.hint}</p>
      </header>

      <ul className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-1">
        {reception.boxes.map((box) => (
          <li key={box.category}>
            <BoxReviewRow box={box} busy={busy} onReview={(review) => onReview(box.category, review)} />
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <span className={cn('text-sm font-medium', pending === 0 ? 'text-risk-safe-ink' : 'text-ink-muted')}>
          {pending === 0 ? t.allDecided : t.pending(pending)}
        </span>
        <Button icon={PackageCheck} disabled={busy || pending > 0} onClick={() => setAsking(true)}>
          {t.confirm}
        </Button>
      </footer>

      <ConfirmDialog
        open={asking}
        title={t.confirmTitle}
        description={t.confirmBody}
        confirmLabel={t.confirm}
        onConfirm={() => {
          setAsking(false);
          onConfirm();
        }}
        onCancel={() => setAsking(false)}
      />
    </Card>
  );
}

function BoxReviewRow({ box, busy, onReview }: { box: ReceptionBox; busy: boolean; onReview: (review: BoxReview) => void }) {
  const [reporting, setReporting] = useState(false);
  const [comment, setComment] = useState('');
  const commentId = useId();

  const issues = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        box.issues > 0 ? 'text-risk-danger-ink' : 'text-risk-safe-ink',
      )}
    >
      {box.issues > 0 ? <CircleAlert aria-hidden size={14} /> : <CircleCheck aria-hidden size={14} />}
      {box.issues > 0 ? t.issues(box.issues) : t.noIssues}
    </span>
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl p-4 ring-1 ring-inset transition-colors duration-200',
        box.decision === 'accepted' && 'bg-risk-safe-soft/60 ring-risk-safe-ink/20',
        box.decision === 'reported' && 'bg-risk-danger-soft/60 ring-risk-danger-ink/20',
        box.decision === 'pending' && 'bg-surface-sunken ring-line',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold">{categoryName(box.category)}</span>
          <span className="text-xs text-ink-muted">
            {es.workspace.analysis.findings.files(box.files)} · {formatBytes(box.bytes)}
          </span>
          {issues}
        </div>

        {box.decision === 'pending' && !reporting && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" icon={MessageSquareWarning} disabled={busy} onClick={() => setReporting(true)}>
              {t.report}
            </Button>
            <Button size="sm" icon={CircleCheck} disabled={busy} onClick={() => onReview({ action: 'accept' })}>
              {t.accept}
            </Button>
          </div>
        )}

        {box.decision !== 'pending' && (
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-semibold',
                box.decision === 'accepted' ? 'text-risk-safe-ink' : 'text-risk-danger-ink',
              )}
            >
              {box.decision === 'accepted' ? <CircleCheck aria-hidden size={16} /> : <MessageSquareWarning aria-hidden size={16} />}
              {box.decision === 'accepted' ? t.accepted : t.reported}
            </span>
            <Button size="sm" variant="ghost" icon={Undo2} disabled={busy} onClick={() => onReview({ action: 'undo' })}>
              {t.undo}
            </Button>
          </div>
        )}
      </div>

      {box.decision === 'reported' && box.comment && <p className="text-sm">«{box.comment}»</p>}

      {box.decision === 'pending' && reporting && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (comment.trim() === '') return;
            onReview({ action: 'report', comment: comment.trim() });
            setReporting(false);
            setComment('');
          }}
        >
          <label htmlFor={commentId} className="text-sm font-medium">
            {t.commentLabel}
          </label>
          <textarea
            id={commentId}
            value={comment}
            maxLength={500}
            rows={2}
            autoFocus
            placeholder={t.commentPlaceholder}
            onChange={(event) => setComment(event.target.value)}
            className="resize-none rounded-xl bg-surface-raised px-3 py-2 text-sm ring-1 ring-line ring-inset"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" icon={X} onClick={() => setReporting(false)}>
              {es.common.cancel}
            </Button>
            <Button size="sm" type="submit" icon={Save} disabled={busy || comment.trim() === ''}>
              {t.send}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function ConfirmedView({
  reception,
  busy,
  onReopen,
  onOpenReceipt,
}: {
  reception: Reception;
  busy: boolean;
  onReopen: () => void;
  onOpenReceipt: () => void;
}) {
  return (
    <Card as="section" className="flex h-full min-h-0 flex-col gap-5">
      <header className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-risk-safe-soft text-risk-safe-ink">
          <PackageCheck aria-hidden size={22} />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-title">{t.done}</h2>
          <p className="text-ink-muted">
            {reception.receiptPath ? t.doneBody : null} {formatDate(reception.confirmedAt!)}
          </p>
        </div>
      </header>

      {!reception.receiptPath && <Alert tone="warn">{t.noReceipt}</Alert>}

      <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
        {reception.boxes.map((box) => (
          <li
            key={box.category}
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm',
              box.decision === 'accepted' ? 'bg-risk-safe-soft text-risk-safe-ink' : 'bg-risk-danger-soft text-risk-danger-ink',
            )}
          >
            <span className="flex min-w-0 flex-col">
              <span className="font-medium">{categoryName(box.category)}</span>
              {box.comment && <span>«{box.comment}»</span>}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              {box.decision === 'accepted' ? <CircleCheck aria-hidden size={16} /> : <MessageSquareWarning aria-hidden size={16} />}
              {box.decision === 'accepted' ? t.accepted : t.reported}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-2">
        {reception.receiptPath && (
          <Button icon={ExternalLink} onClick={onOpenReceipt}>
            {t.openReceipt}
          </Button>
        )}
        <Button variant="ghost" icon={RotateCcw} disabled={busy} onClick={onReopen}>
          {t.reopen}
        </Button>
      </div>
    </Card>
  );
}
