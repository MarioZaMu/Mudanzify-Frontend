import { CircleCheck, Lock, PartyPopper, RotateCcw } from 'lucide-react';
import type { TransferInterview } from '@/bridge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';

const t = es.workspace.interview;

/** Final screen of the interview: the criteria the sender kept. */
export function InterviewDone({
  interview,
  busy,
  onRestart,
}: {
  interview: TransferInterview;
  busy: boolean;
  onRestart: () => void;
}) {
  const applied = interview.suggestions.filter((s) => s.status === 'accepted' || s.status === 'edited');
  const discarded = interview.suggestions.length - applied.length;

  return (
    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
      <Card as="section" className="flex min-h-0 flex-col gap-5">
        <header className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-risk-safe-soft text-risk-safe-ink">
            <PartyPopper aria-hidden size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-title">{t.done.title}</h2>
            <p className="text-ink-muted">{t.done.body}</p>
          </div>
        </header>

        <h3 className="font-semibold">{t.done.applied}</h3>
        {applied.length === 0 ? (
          <p className="text-sm text-ink-muted">{t.done.noneApplied}</p>
        ) : (
          <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
            {applied.map((criterion) => (
              <li key={criterion.id} className="flex items-start gap-3 rounded-2xl bg-surface-sunken p-3">
                <CircleCheck aria-hidden size={18} className="mt-0.5 shrink-0 text-risk-safe-ink" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">
                    {criterion.title}
                    <span className="ml-2 text-xs font-medium text-ink-muted">· {t.topics[criterion.topic]}</span>
                  </span>
                  {criterion.detail && <span className="text-sm text-ink-muted">{criterion.detail}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
        {discarded > 0 && <p className="text-sm text-ink-muted">{t.done.discarded(discarded)}</p>}
      </Card>

      <Card variant="sunken" className="flex min-h-0 flex-col justify-between gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold">{t.done.next}</p>
          <Badge icon={Lock} tone="inverse" className="w-fit">
            {t.done.soon}
          </Badge>
        </div>
        <Button variant="outline" icon={RotateCcw} disabled={busy} className="self-start" onClick={onRestart}>
          {t.restart}
        </Button>
      </Card>
    </div>
  );
}
