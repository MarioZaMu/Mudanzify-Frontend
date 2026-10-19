import { CheckCheck, RotateCcw, Save, Sparkles, X } from 'lucide-react';
import { useId, useState } from 'react';
import type { CriterionSuggestion, ReviewDecision, TransferInterview } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { AiSuggestion } from '@/components/ui/AiSuggestion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';

const t = es.workspace.interview;

interface CriteriaReviewProps {
  interview: TransferInterview;
  busy: boolean;
  onReview: (suggestionId: string, decision: ReviewDecision) => void;
  onConfirm: () => void;
  onRestart: () => void;
}

/** The AI's summary and its criteria, each accepted, edited or rejected on its own. */
export function CriteriaReview({ interview, busy, onReview, onConfirm, onRestart }: CriteriaReviewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const pending = interview.suggestions.filter((suggestion) => suggestion.status === 'pending').length;

  return (
    <div className="grid h-full min-h-0 gap-6 @3xl:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <Card variant="inverse" as="section" className="flex min-h-0 flex-col gap-4 overflow-y-auto">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-ink">
          <Sparkles aria-hidden size={22} />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">{t.review.summaryTitle}</h2>
          <p className="opacity-85">{interview.summary}</p>
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-current/15 pt-4">
          <Badge tone={pending > 0 ? 'accent' : 'primary'} className="w-fit">
            {pending > 0 ? t.review.pending(pending) : t.review.allDecided}
          </Badge>
          <div className="flex flex-wrap gap-2">
            <Button icon={CheckCheck} disabled={pending > 0 || busy || editingId !== null} onClick={onConfirm}>
              {t.review.confirm}
            </Button>
            <Button variant="outline" icon={RotateCcw} disabled={busy} onClick={onRestart}>
              {t.restart}
            </Button>
          </div>
        </div>
      </Card>

      <section aria-labelledby="criteria-title" className="flex min-h-0 flex-col gap-3">
        <header className="flex flex-col gap-1">
          <h2 id="criteria-title" className="text-lg font-semibold">
            {t.review.title}
          </h2>
          <p className="text-sm text-ink-muted">{t.review.hint}</p>
        </header>

        {interview.suggestions.length === 0 ? (
          <Alert tone="info">{t.review.none}</Alert>
        ) : (
          <ul className="flex min-h-0 flex-col gap-3 overflow-y-auto p-1">
            {interview.suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                {editingId === suggestion.id ? (
                  <EditCriterion
                    suggestion={suggestion}
                    busy={busy}
                    onCancel={() => setEditingId(null)}
                    onSave={(title, detail) => {
                      onReview(suggestion.id, { action: 'edit', title, detail });
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <AiSuggestion
                    title={suggestion.title}
                    body={suggestion.detail}
                    meta={t.topics[suggestion.topic]}
                    decision={suggestion.status}
                    disabled={busy}
                    onAccept={() => onReview(suggestion.id, { action: 'accept' })}
                    onEdit={() => setEditingId(suggestion.id)}
                    onReject={() => onReview(suggestion.id, { action: 'reject' })}
                    onUndo={() => onReview(suggestion.id, { action: 'undo' })}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EditCriterion({
  suggestion,
  busy,
  onSave,
  onCancel,
}: {
  suggestion: CriterionSuggestion;
  busy: boolean;
  onSave: (title: string, detail: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(suggestion.title);
  const [detail, setDetail] = useState(suggestion.detail);
  const titleId = useId();
  const detailId = useId();
  const original = suggestion.original ?? { title: suggestion.title, detail: suggestion.detail };

  return (
    <form
      className="flex flex-col gap-4 rounded-card bg-surface-raised p-5 shadow-soft ring-2 ring-primary animate-[rise-in_250ms_var(--ease-out-soft)_both]"
      onSubmit={(event) => {
        event.preventDefault();
        if (title.trim()) onSave(title.trim(), detail.trim());
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={titleId} className="text-sm font-medium">
          {t.edit.titleLabel}
        </label>
        <input
          id={titleId}
          value={title}
          maxLength={120}
          required
          autoFocus
          onChange={(event) => setTitle(event.target.value)}
          className="h-11 rounded-xl bg-surface-sunken px-3 text-sm ring-1 ring-line ring-inset"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={detailId} className="text-sm font-medium">
          {t.edit.detailLabel}
        </label>
        <textarea
          id={detailId}
          value={detail}
          maxLength={400}
          rows={2}
          onChange={(event) => setDetail(event.target.value)}
          className="resize-none rounded-xl bg-surface-sunken px-3 py-2 text-sm ring-1 ring-line ring-inset"
        />
      </div>
      <p className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary-soft-ink">
        <span className="font-semibold">{t.edit.original}:</span> {original.title}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon={X} onClick={onCancel}>
          {es.common.cancel}
        </Button>
        <Button type="submit" icon={Save} disabled={busy || title.trim() === ''}>
          {t.edit.save}
        </Button>
      </div>
    </form>
  );
}
