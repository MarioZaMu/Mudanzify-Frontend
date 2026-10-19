import { Check, Pencil, Sparkles, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { Button } from './Button';

export type SuggestionDecision = 'pending' | 'accepted' | 'edited' | 'rejected';

interface AiSuggestionProps {
  title: string;
  body: string;
  /** Small label next to the AI badge, e.g. the topic of the suggestion. */
  meta?: string;
  /**
   * Pass it to control the decision from outside (e.g. saved in the backend).
   * Without it the card keeps its own state, as in the design system showcase.
   */
  decision?: SuggestionDecision;
  disabled?: boolean;
  onAccept?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
  onUndo?: () => void;
}

const DECIDED_LABELS: Record<Exclude<SuggestionDecision, 'pending'>, string> = {
  accepted: es.ai.accepted,
  edited: es.ai.edited,
  rejected: es.ai.rejected,
};

/**
 * A single AI proposal. Indigo marks it as coming from the AI, and the user
 * always decides: accept, edit or reject, one suggestion at a time.
 */
export function AiSuggestion({
  title,
  body,
  meta,
  decision: controlled,
  disabled = false,
  onAccept,
  onEdit,
  onReject,
  onUndo,
}: AiSuggestionProps) {
  const [local, setLocal] = useState<SuggestionDecision>('pending');
  const decision = controlled ?? local;

  const decide = (next: SuggestionDecision, callback?: () => void) => {
    if (controlled === undefined) setLocal(next);
    callback?.();
  };

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-card bg-primary-soft p-5 text-ink ring-1 ring-primary/25',
        'transition-opacity duration-200',
        decision === 'rejected' && 'opacity-70',
      )}
    >
      <header className="flex items-center gap-2 text-sm font-semibold text-primary-soft-ink">
        <Sparkles aria-hidden size={16} />
        {es.ai.badge}
        {meta && <span className="font-medium opacity-80">· {meta}</span>}
      </header>

      <div className="flex flex-col gap-1">
        <h3 className={cn('font-semibold', decision === 'rejected' && 'line-through')}>{title}</h3>
        <p className="text-sm text-ink-muted">{body}</p>
      </div>

      {decision === 'pending' ? (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon={Check} disabled={disabled} onClick={() => decide('accepted', onAccept)}>
            {es.ai.accept}
          </Button>
          <Button size="sm" variant="outline" icon={Pencil} disabled={disabled} onClick={onEdit}>
            {es.ai.edit}
          </Button>
          <Button size="sm" variant="ghost" icon={X} disabled={disabled} onClick={() => decide('rejected', onReject)}>
            {es.ai.reject}
          </Button>
        </div>
      ) : (
        <div role="status" className="flex items-center justify-between gap-3 text-sm font-medium">
          <span className="flex items-center gap-2">
            {decision === 'rejected' ? <X aria-hidden size={16} /> : <Check aria-hidden size={16} />}
            {DECIDED_LABELS[decision]}
          </span>
          <Button size="sm" variant="ghost" icon={Undo2} disabled={disabled} onClick={() => decide('pending', onUndo)}>
            {es.ai.undo}
          </Button>
        </div>
      )}
    </article>
  );
}
