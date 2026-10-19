import { Check, ListChecks, Sparkles, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { FINDING_CHOICES, type Finding, type FindingChoice, type FindingDecision, type Inventory } from '@/bridge';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { describeFinding } from './describe';

const t = es.workspace.analysis.findings;
const MAX_FILES = 4;

interface FindingCardProps {
  finding: Finding;
  inventory: Inventory;
  disabled: boolean;
  onDecide: (decision: FindingDecision) => void;
  /** Called instead of onDecide when the choice would expose personal data. */
  onIncludeSensitive: (decision: FindingDecision) => void;
}

/** One local detection with the suggested choice: accept, pick another option or leave it as is. */
export function FindingCard({ finding, inventory, disabled, onDecide, onIncludeSensitive }: FindingCardProps) {
  const [choosing, setChoosing] = useState(false);
  const text = describeFinding(finding, inventory);
  const choices = FINDING_CHOICES[finding.kind];
  const shownFiles = text.files.slice(0, MAX_FILES);

  // Leaving a sensitive column as is means sending it unmasked: that needs its own confirmation.
  const decide = (decision: FindingDecision, choice: FindingChoice) => {
    setChoosing(false);
    if (finding.kind === 'sensitive-column' && choice === 'include') onIncludeSensitive(decision);
    else onDecide(decision);
  };

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-card bg-surface-raised p-5 shadow-soft ring-1 ring-line',
        finding.risk === 'danger' && 'ring-risk-danger/40',
        finding.status === 'dismissed' && 'opacity-75',
      )}
    >
      <header className="flex flex-wrap items-center gap-2">
        <RiskBadge level={finding.risk} />
        <span className="text-sm font-medium text-ink-muted">{t.kinds[finding.kind]}</span>
      </header>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{text.title}</h3>
        {text.subtitle && (
          <p className="truncate text-sm text-ink-muted" title={text.subtitle}>
            {text.subtitle}
          </p>
        )}
        {shownFiles.length > 0 && (
          <ul className="mt-1 flex flex-col gap-0.5 font-mono text-xs text-ink-muted">
            {shownFiles.map((name) => (
              <li key={name} className="truncate" title={name}>
                {name}
              </li>
            ))}
            {text.files.length > MAX_FILES && <li>{t.more(text.files.length - MAX_FILES)}</li>}
          </ul>
        )}
        {text.note && <p className="mt-1 text-sm">{text.note}</p>}
      </div>

      {finding.status === 'pending' ? (
        choosing ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-medium">{t.change}</legend>
            <div className="flex flex-wrap gap-2">
              {choices.map((choice) => (
                <Button
                  key={choice}
                  size="sm"
                  variant={choice === 'include' && finding.kind === 'sensitive-column' ? 'outline' : 'secondary'}
                  disabled={disabled}
                  onClick={() => decide({ action: 'change', choice }, choice)}
                >
                  {t.choices[choice]}
                </Button>
              ))}
              <Button size="sm" variant="ghost" icon={X} onClick={() => setChoosing(false)}>
                {t.cancelChange}
              </Button>
            </div>
          </fieldset>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-auto flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary-soft-ink">
              <Sparkles aria-hidden size={14} />
              {t.suggested}: {t.choices[finding.suggested]}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" icon={Check} disabled={disabled} onClick={() => decide({ action: 'accept' }, finding.suggested)}>
                {es.ai.accept}
              </Button>
              <Button size="sm" variant="outline" icon={ListChecks} disabled={disabled} onClick={() => setChoosing(true)}>
                {t.change}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={X}
                disabled={disabled}
                onClick={() => decide({ action: 'dismiss' }, choices[choices.length - 1])}
              >
                {t.dismiss}
              </Button>
            </div>
          </div>
        )
      ) : (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium">
          <span className="flex items-center gap-2">
            {finding.status === 'dismissed' ? <X aria-hidden size={16} /> : <Check aria-hidden size={16} />}
            {finding.status === 'dismissed' || !finding.choice
              ? t.statuses.dismissed
              : t.statuses[finding.status](t.choices[finding.choice])}
          </span>
          <Button size="sm" variant="ghost" icon={Undo2} disabled={disabled} onClick={() => onDecide({ action: 'undo' })}>
            {es.ai.undo}
          </Button>
        </div>
      )}
    </article>
  );
}
