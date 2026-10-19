import { ArrowRight, CircleAlert, CircleCheck, FilePlus, FileX, Scale, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { FileCheck, Reception, VerifyProgress } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { categoryName } from '../transfers/analysis/describe';

const t = es.receptions.verify;

/** Never color alone: every check has its icon and its word. */
export const CHECK_STYLE: Record<FileCheck, { icon: LucideIcon; className: string }> = {
  ok: { icon: CircleCheck, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  unverified: { icon: Scale, className: 'bg-risk-warn-soft text-risk-warn-ink' },
  missing: { icon: FileX, className: 'bg-risk-danger-soft text-risk-danger-ink' },
  changed: { icon: CircleAlert, className: 'bg-risk-danger-soft text-risk-danger-ink' },
};

const CHECK_ORDER: FileCheck[] = ['ok', 'unverified', 'missing', 'changed'];

interface VerifyStepProps {
  reception: Reception;
  running: boolean;
  busy: boolean;
  progress: VerifyProgress | null;
  onVerify: () => void;
  onNext: () => void;
}

/** Recomputes each fingerprint and compares it with the sender's; read-only. */
export function VerifyStep({ reception, running, busy, progress, onVerify, onNext }: VerifyStepProps) {
  const verified = reception.verifiedAt !== null && !running;
  const problems = reception.files.filter((file) => file.check === 'missing' || file.check === 'changed');
  const percent = progress && progress.total > 0 ? (progress.done / progress.total) * 100 : 0;

  return (
    <div className="grid h-full min-h-0 gap-6 @3xl:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
      <Card as="section" className="flex min-h-0 flex-col gap-5">
        <header className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-soft-ink">
            <ShieldCheck aria-hidden size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-title">{t.title}</h2>
            <p className="text-ink-muted">{t.intro}</p>
          </div>
        </header>

        {running && (
          <div className="flex flex-col gap-2" aria-live="polite">
            <ProgressBar
              value={percent}
              tone="primary"
              label={progress ? t.progress(progress.done, progress.total) : t.running}
            />
            {progress?.current && <p className="truncate font-mono text-xs text-ink-muted">{progress.current}</p>}
          </div>
        )}

        {verified && (
          <Alert tone={problems.length === 0 ? 'safe' : 'danger'}>
            {problems.length === 0 ? t.allGood : t.someIssues}
          </Alert>
        )}

        {verified && (
          <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
            {reception.boxes.map((box) => {
              const files = reception.files.filter((file) => file.category === box.category);
              return (
                <li
                  key={box.category}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-sunken px-4 py-3"
                >
                  <span className="font-medium">{categoryName(box.category)}</span>
                  <span className="flex flex-wrap gap-2">
                    {CHECK_ORDER.map((check) => {
                      const count = files.filter((file) => file.check === check).length;
                      if (count === 0) return null;
                      const { icon: Icon, className } = CHECK_STYLE[check];
                      return (
                        <span
                          key={check}
                          title={t.checksHint[check]}
                          className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', className)}
                        >
                          <Icon aria-hidden size={14} />
                          {count} · {t.checks[check]}
                        </span>
                      );
                    })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <Button
            variant={verified ? 'outline' : 'primary'}
            icon={ShieldCheck}
            loading={running}
            disabled={busy}
            onClick={onVerify}
          >
            {running ? t.running : verified ? t.again : t.start}
          </Button>
          {verified && reception.verifiedAt && (
            <span className="text-xs text-ink-muted">{formatDate(reception.verifiedAt)}</span>
          )}
        </div>
      </Card>

      <Card variant="sunken" className="flex min-h-0 flex-col gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
          <section className="flex flex-col gap-2">
            <h3 className="font-semibold">{t.problems}</h3>
            {!verified ? (
              <p className="text-sm text-ink-muted">{es.receptions.card.notVerified}</p>
            ) : problems.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-risk-safe-ink">
                <CircleCheck aria-hidden size={16} />
                {t.allGood}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {problems.map((file) => {
                  const { icon: Icon, className } = CHECK_STYLE[file.check!];
                  return (
                    <li key={file.path} className={cn('flex items-start gap-3 rounded-2xl p-3 text-sm', className)}>
                      <Icon aria-hidden size={16} className="mt-0.5 shrink-0" />
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium break-all">{file.path}</span>
                        <span>{t.checksHint[file.check!]}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {verified && reception.extras.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="font-semibold">{t.extras}</h3>
              <p className="text-sm text-ink-muted">{t.extrasHint}</p>
              <ul className="flex flex-col gap-2">
                {reception.extras.map((extra) => (
                  <li key={extra} className="flex items-center gap-3 rounded-2xl bg-risk-warn-soft p-3 text-sm text-risk-warn-ink">
                    <FilePlus aria-hidden size={16} className="shrink-0" />
                    <span className="break-all">{extra}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <Button icon={ArrowRight} iconPosition="end" disabled={!verified} className="self-start" onClick={onNext}>
          {t.next}
        </Button>
      </Card>
    </div>
  );
}
