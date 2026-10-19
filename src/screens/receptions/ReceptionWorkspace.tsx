import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Reception } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { PillStepper } from '@/components/ui/PillStepper';
import { useReception } from '@/hooks/useReception';
import { es } from '@/i18n/es';
import { ConfirmStep } from './ConfirmStep';
import { ReceivedStep } from './ReceivedStep';
import { VerifyStep } from './VerifyStep';

const t = es.receptions;

const RECEPTION_STEPS = ['received', 'verify', 'confirm'] as const;
type ReceptionStep = (typeof RECEPTION_STEPS)[number];

/** Resumes on the furthest step: confirming once the files were checked. */
const initialStep = (reception: Reception): ReceptionStep => (reception.verifiedAt ? 'confirm' : 'received');

interface ReceptionWorkspaceProps {
  id: string;
  onBack: () => void;
}

/** One received folder: Lo recibido → Verificación → Confirmar. */
export function ReceptionWorkspace({ id, onBack }: ReceptionWorkspaceProps) {
  const reception = useReception(id);
  const current = reception.reception;
  const [step, setStep] = useState<ReceptionStep | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (current && step === null) setStep(initialStep(current));
  }, [current, step]);

  const goTo = (next: ReceptionStep) => {
    if (step) setDirection(RECEPTION_STEPS.indexOf(next) >= RECEPTION_STEPS.indexOf(step) ? 'next' : 'prev');
    setStep(next);
  };

  if (reception.loadFailed) {
    return (
      <div className="flex h-full flex-col gap-6">
        <BackButton onBack={onBack} />
        <Alert tone="danger">{t.errors.load}</Alert>
      </div>
    );
  }

  if (!current || !step) {
    return <p className="text-ink-muted">{es.common.loading}</p>;
  }

  const verified = current.verifiedAt !== null;
  const busy = reception.task !== null;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 animate-[rise-in_400ms_var(--ease-out-soft)_both]">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton onBack={onBack} />
          <h1 className="truncate px-2 text-2xl font-semibold tracking-tight">{current.transferName}</h1>
        </div>
        <PillStepper
          steps={RECEPTION_STEPS}
          labels={t.steps}
          label={t.steps.label}
          active={step}
          onSelect={goTo}
          available={{ received: true, verify: true, confirm: verified }}
          completed={{ received: verified, verify: verified, confirm: current.confirmedAt !== null }}
        />
      </header>

      {reception.failed && <Alert tone="danger">{t.errors.generic}</Alert>}

      <div
        key={step}
        className={
          direction === 'next'
            ? 'min-h-0 flex-1 animate-[slide-in-next_400ms_var(--ease-out-soft)_both]'
            : 'min-h-0 flex-1 animate-[slide-in-prev_400ms_var(--ease-out-soft)_both]'
        }
      >
        {step === 'received' && (
          <ReceivedStep
            reception={current}
            onOpenReport={() => void reception.openReport()}
            onOpenFolder={() => void reception.openFolder()}
            onNext={() => goTo('verify')}
          />
        )}
        {step === 'verify' && (
          <VerifyStep
            reception={current}
            running={reception.task === 'verify'}
            busy={busy}
            progress={reception.progress}
            onVerify={() => void reception.verify()}
            onNext={() => goTo('confirm')}
          />
        )}
        {step === 'confirm' && (
          <ConfirmStep
            reception={current}
            busy={busy}
            onReview={(category, review) => void reception.reviewBox(category, review)}
            onConfirm={() => void reception.confirm()}
            onReopen={() => void reception.reopen()}
            onOpenReceipt={() => void reception.openReceipt()}
          />
        )}
      </div>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
      {t.back}
    </Button>
  );
}
