import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { TransferDraft } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useTransfer } from '@/hooks/useTransfer';
import { es } from '@/i18n/es';
import { AnalysisOverlay } from './analysis/AnalysisOverlay';
import { AnalysisStep } from './analysis/AnalysisStep';
import { DestinationStep } from './DestinationStep';
import { InterviewStep } from './interview/InterviewStep';
import { InventoryStep } from './InventoryStep';
import { OriginStep } from './OriginStep';
import { ScanOverlay } from './ScanOverlay';
import { WORKSPACE_STEPS, WorkspaceStepper, type WorkspaceStep } from './WorkspaceStepper';

interface TransferWorkspaceProps {
  id: string;
  onBack: () => void;
}

/** Resumes a draft on the furthest step it already reached. */
function initialStep(draft: TransferDraft): WorkspaceStep {
  if (draft.inventory && draft.analysis) return 'analysis';
  if (draft.inventory && draft.interview) return 'interview';
  if (draft.inventory && draft.destination) return 'destination';
  if (draft.inventory) return 'inventory';
  return 'origin';
}

/** Destination chosen and free of conflicts: the interview can start. */
const destinationReady = (draft: TransferDraft) =>
  draft.inventory !== null && draft.destination !== null && draft.destination.conflicts.length === 0;

/** Criteria confirmed: the analysis can run. */
const interviewDone = (draft: TransferDraft) => draft.interview?.status === 'done';

/** One transfer, one step per screen: Origen → Inventario → Destino → Entrevista IA → Revisión IA. */
export function TransferWorkspace({ id, onBack }: TransferWorkspaceProps) {
  const transfer = useTransfer(id);
  const { draft } = transfer;
  const [step, setStep] = useState<WorkspaceStep | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  useEffect(() => {
    if (draft && step === null) setStep(initialStep(draft));
  }, [draft, step]);

  // Changing the sources clears the inventory, so later steps go back to origin.
  useEffect(() => {
    if (draft && !draft.inventory && step !== 'origin' && step !== null) setStep('origin');
    else if (draft && step === 'interview' && !draft.interview && !destinationReady(draft)) setStep('destination');
    else if (draft && step === 'analysis' && !draft.analysis && !interviewDone(draft)) setStep('interview');
  }, [draft, step]);

  const goTo = (next: WorkspaceStep) => {
    if (step) setDirection(WORKSPACE_STEPS.indexOf(next) >= WORKSPACE_STEPS.indexOf(step) ? 'next' : 'prev');
    setStep(next);
  };

  if (transfer.loadFailed) {
    return (
      <div className="flex h-full flex-col gap-6">
        <BackButton onBack={onBack} />
        <Alert tone="danger">{es.transfers.errors.load}</Alert>
      </div>
    );
  }

  if (!draft || !step) {
    return <p className="text-ink-muted">{es.common.loading}</p>;
  }

  const hasInventory = draft.inventory !== null;
  const busy = transfer.task !== null;

  const onScan = async () => {
    const next = await transfer.scan();
    if (next?.inventory) goTo('inventory');
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4 animate-[rise-in_400ms_var(--ease-out-soft)_both]">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton onBack={onBack} />
          <TransferName name={draft.name} disabled={busy} onRename={(name) => void transfer.rename(name)} />
        </div>
        <WorkspaceStepper
          active={step}
          onSelect={goTo}
          available={{
            origin: true,
            inventory: hasInventory,
            destination: hasInventory,
            interview: destinationReady(draft) || draft.interview !== null,
            analysis: interviewDone(draft) || draft.analysis !== null,
          }}
          completed={{
            origin: hasInventory,
            inventory: hasInventory && draft.destination !== null,
            destination: destinationReady(draft),
            interview: interviewDone(draft),
            analysis: draft.analysis?.confirmed === true,
          }}
        />
      </header>

      {transfer.error && (
        <Alert tone="danger">
          {transfer.error === 'scan'
            ? es.transfers.errors.scan
            : transfer.error === 'ai'
              ? step === 'analysis'
                ? es.workspace.analysis.error
                : es.workspace.interview.error
              : transfer.error === 'ai-limit'
                ? es.workspace.interview.errorLimit
                : transfer.error === 'ai-auth'
                  ? es.workspace.interview.errorAuth
                  : es.transfers.errors.generic}
        </Alert>
      )}

      <div
        key={step}
        className={
          direction === 'next'
            ? 'min-h-0 flex-1 animate-[slide-in-next_400ms_var(--ease-out-soft)_both]'
            : 'min-h-0 flex-1 animate-[slide-in-prev_400ms_var(--ease-out-soft)_both]'
        }
      >
        {step === 'origin' && (
          <OriginStep
            draft={draft}
            busy={busy}
            onAdd={(kind) => void transfer.addSources(kind)}
            onRemove={(sourceId) => void transfer.removeSource(sourceId)}
            onScan={() => void onScan()}
            onViewInventory={() => goTo('inventory')}
          />
        )}
        {step === 'inventory' && draft.inventory && (
          <InventoryStep inventory={draft.inventory} onNext={() => goTo('destination')} />
        )}
        {step === 'destination' && (
          <DestinationStep
            draft={draft}
            busy={transfer.task === 'destination'}
            onPick={() => void transfer.pickDestination()}
            onStartInterview={() => goTo('interview')}
          />
        )}
        {step === 'interview' && (
          <InterviewStep
            interview={draft.interview}
            thinking={transfer.task === 'interview'}
            busy={busy}
            onStart={() => void transfer.interview.start()}
            onAnswer={(answer) => void transfer.interview.answer(answer)}
            onReview={(suggestionId, decision) => void transfer.interview.review(suggestionId, decision)}
            onFinish={() => void transfer.interview.finish()}
            onRestart={() => void transfer.interview.reset()}
            onNext={() => goTo('analysis')}
          />
        )}
        {step === 'analysis' && draft.inventory && (
          <AnalysisStep
            analysis={draft.analysis}
            inventory={draft.inventory}
            running={transfer.task === 'analysis'}
            busy={busy}
            onRun={() => void transfer.analysis.run()}
            onDecideFinding={(findingId, decision) => void transfer.analysis.decideFinding(findingId, decision)}
            onReviewMapping={(mappingId, decision) => void transfer.analysis.reviewMapping(mappingId, decision)}
            onSetPriority={(decision) => void transfer.analysis.setPriority(decision)}
            onConfirm={() => void transfer.analysis.confirm()}
            onRerun={() => void transfer.analysis.run()}
          />
        )}
      </div>

      {transfer.task === 'scan' && <ScanOverlay progress={transfer.progress} />}
      {transfer.task === 'analysis' && <AnalysisOverlay progress={transfer.analysisProgress} />}
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
      {es.workspace.back}
    </Button>
  );
}

/** Inline-editable name; saved on blur or Enter, reverted with Escape. */
function TransferName({ name, disabled, onRename }: { name: string; disabled: boolean; onRename: (name: string) => void }) {
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setValue(name), [name]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === name) {
      setValue(name);
      return;
    }
    onRename(trimmed);
  };

  return (
    <input
      ref={inputRef}
      aria-label={es.workspace.nameLabel}
      value={value}
      maxLength={80}
      disabled={disabled}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') inputRef.current?.blur();
        if (event.key === 'Escape') {
          setValue(name);
          requestAnimationFrame(() => inputRef.current?.blur());
        }
      }}
      className="min-w-0 rounded-xl bg-transparent px-2 py-1 text-2xl font-semibold tracking-tight transition-colors hover:bg-surface-sunken focus:bg-surface-raised"
    />
  );
}
