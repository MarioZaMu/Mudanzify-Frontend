import { ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { InterviewAnswerInput, ReviewDecision, TransferInterview } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAiStatus } from '@/hooks/useAiStatus';
import { es } from '@/i18n/es';
import { AiModeBadge } from './AiModeBadge';
import { AnswerHistory } from './AnswerHistory';
import { CriteriaReview } from './CriteriaReview';
import { InterviewDone } from './InterviewDone';
import { QuestionCard } from './QuestionCard';

const t = es.workspace.interview;

interface InterviewStepProps {
  interview: TransferInterview | null;
  /** An AI request (start or answer) is in flight. */
  thinking: boolean;
  busy: boolean;
  onStart: () => void;
  onAnswer: (answer: InterviewAnswerInput | null) => void;
  onReview: (suggestionId: string, decision: ReviewDecision) => void;
  onFinish: () => void;
  onRestart: () => void;
  onNext: () => void;
}

/** Step 4: the AI asks, the sender answers, then reviews each proposed criterion. */
export function InterviewStep(props: InterviewStepProps) {
  const { interview, thinking, busy } = props;
  const aiStatus = useAiStatus();
  const [confirming, setConfirming] = useState<'finish' | 'restart' | null>(null);
  const mode = interview?.mode ?? aiStatus?.mode ?? 'demo';
  const model = aiStatus?.mode === 'ai' ? aiStatus.model : null;

  const header = (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {(interview || aiStatus) && <AiModeBadge mode={mode} model={model} />}
      <p className="flex min-w-0 flex-1 items-center gap-2 text-xs text-ink-muted">
        <ShieldCheck aria-hidden size={14} className="shrink-0 text-risk-safe-ink" />
        {t.privacy}
      </p>
    </header>
  );

  let body;
  if (!interview) {
    body = (
      <div className="grid flex-1 place-items-center">
        <div className="flex max-w-xl flex-col items-center gap-6 text-center">
          <span className="grid size-20 place-items-center rounded-[1.75rem] bg-primary text-primary-ink shadow-lifted animate-[float_5s_ease-in-out_infinite]">
            <Sparkles aria-hidden size={36} />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-title">{t.title}</h2>
            <p className="text-lg text-ink-muted">{t.intro}</p>
          </div>
          {mode === 'demo' && aiStatus && <Alert tone="warn">{t.mode.demoHint}</Alert>}
          <Button size="lg" icon={Sparkles} loading={thinking} onClick={props.onStart}>
            {t.start}
          </Button>
        </div>
      </div>
    );
  } else if (interview.status === 'asking') {
    const open = interview.turns.at(-1);
    const question = open && open.answer === null ? open.question : null;
    body = (
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <QuestionCard question={question} index={interview.turns.length} thinking={thinking} onAnswer={props.onAnswer} />
        <AnswerHistory turns={interview.turns} />
      </div>
    );
  } else if (interview.status === 'reviewing') {
    body = (
      <div className="min-h-0 flex-1">
        <CriteriaReview
          interview={interview}
          busy={busy}
          onReview={props.onReview}
          onConfirm={() => setConfirming('finish')}
          onRestart={() => setConfirming('restart')}
        />
      </div>
    );
  } else {
    body = (
      <div className="min-h-0 flex-1">
        <InterviewDone interview={interview} busy={busy} onRestart={() => setConfirming('restart')} onNext={props.onNext} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {header}
      {body}
      <ConfirmDialog
        open={confirming !== null}
        title={confirming === 'finish' ? t.review.confirmTitle : t.restartTitle}
        description={confirming === 'finish' ? t.review.confirmBody : t.restartBody}
        confirmLabel={confirming === 'finish' ? t.review.confirm : t.restart}
        onConfirm={() => {
          if (confirming === 'finish') props.onFinish();
          else props.onRestart();
          setConfirming(null);
        }}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
