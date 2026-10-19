import { MessageSquareText } from 'lucide-react';
import type { InterviewTurn } from '@/bridge';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';

const t = es.workspace.interview;

/** Questions already answered, newest last; the list scrolls inside the card. */
export function AnswerHistory({ turns }: { turns: InterviewTurn[] }) {
  const answered = turns.filter((turn) => turn.answer !== null);

  return (
    <Card variant="sunken" as="section" aria-label={t.historyTitle} className="flex min-h-0 flex-col gap-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <MessageSquareText aria-hidden size={18} />
        {t.historyTitle}
      </h3>
      {answered.length === 0 ? (
        <p className="text-sm text-ink-muted">{t.historyEmpty}</p>
      ) : (
        <ol className="flex min-h-0 flex-col gap-3 overflow-y-auto">
          {answered.map((turn, index) => (
            <li
              key={turn.question.id}
              className="flex flex-col gap-1 rounded-2xl bg-surface-raised p-3 animate-[rise-in_300ms_var(--ease-out-soft)_both]"
            >
              <span className="text-xs text-ink-muted">
                {index + 1}. {turn.question.text}
              </span>
              <span className="text-sm font-medium">
                {turn.answer?.skipped
                  ? t.skipped
                  : [...(turn.answer?.choices ?? []), turn.answer?.text ?? ''].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
