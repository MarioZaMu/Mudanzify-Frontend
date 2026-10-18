import { Check, Pencil, Sparkles, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { Button } from './Button';

type Decision = 'pending' | 'accepted' | 'rejected';

interface AiSuggestionProps {
  title: string;
  body: string;
  onAccept?: () => void;
  onEdit?: () => void;
  onReject?: () => void;
}

/**
 * A single AI proposal. Indigo marks it as coming from the AI, and the user
 * always decides: accept, edit or reject, one suggestion at a time.
 */
export function AiSuggestion({ title, body, onAccept, onEdit, onReject }: AiSuggestionProps) {
  const [decision, setDecision] = useState<Decision>('pending');

  const decide = (next: Decision, callback?: () => void) => {
    setDecision(next);
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
      </header>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-ink-muted">{body}</p>
      </div>

      {decision === 'pending' ? (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" icon={Check} onClick={() => decide('accepted', onAccept)}>
            {es.ai.accept}
          </Button>
          <Button size="sm" variant="outline" icon={Pencil} onClick={onEdit}>
            {es.ai.edit}
          </Button>
          <Button size="sm" variant="ghost" icon={X} onClick={() => decide('rejected', onReject)}>
            {es.ai.reject}
          </Button>
        </div>
      ) : (
        <div role="status" className="flex items-center justify-between gap-3 text-sm font-medium">
          <span className="flex items-center gap-2">
            {decision === 'accepted' ? <Check aria-hidden size={16} /> : <X aria-hidden size={16} />}
            {decision === 'accepted' ? es.ai.accepted : es.ai.rejected}
          </span>
          <Button size="sm" variant="ghost" icon={Undo2} onClick={() => setDecision('pending')}>
            {es.ai.undo}
          </Button>
        </div>
      )}
    </article>
  );
}
