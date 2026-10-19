import {
  Check,
  Lightbulb,
  LoaderCircle,
  Send,
  SkipForward,
  Sparkles,
} from "lucide-react";
import { useId, useState } from "react";
import {
  INTERVIEW_LIMITS,
  type InterviewAnswerInput,
  type InterviewQuestion,
} from "@/bridge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { es } from "@/i18n/es";
import { cn } from "@/lib/cn";

const t = es.workspace.interview;

interface QuestionCardProps {
  question: InterviewQuestion | null;
  index: number;
  thinking: boolean;
  onAnswer: (answer: InterviewAnswerInput | null) => void;
}

/** The open question: quick-answer chips, free text, skip or answer. */
export function QuestionCard({
  question,
  index,
  thinking,
  onAnswer,
}: QuestionCardProps) {
  if (thinking || !question) {
    return (
      <Card
        className="flex h-full flex-col items-center justify-center gap-4 text-center"
        aria-live="polite"
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary-soft-ink">
          <LoaderCircle aria-hidden size={26} className="animate-spin" />
        </span>
        <p className="font-medium">{t.thinking}</p>
      </Card>
    );
  }

  // Remount per question so the selection resets and the entrance animation replays.
  return (
    <OpenQuestion
      key={question.id}
      question={question}
      index={index}
      onAnswer={onAnswer}
    />
  );
}

function OpenQuestion({
  question,
  index,
  onAnswer,
}: {
  question: InterviewQuestion;
  index: number;
  onAnswer: (answer: InterviewAnswerInput | null) => void;
}) {
  const [choices, setChoices] = useState<string[]>([]);
  const [text, setText] = useState("");
  const headingId = useId();
  const textId = useId();
  const canSend = choices.length > 0 || text.trim() !== "";

  const toggle = (option: string) => {
    setChoices((current) => {
      if (current.includes(option))
        return current.filter((item) => item !== option);
      return question.multiple ? [...current, option] : [option];
    });
  };

  return (
    <Card
      as="section"
      aria-labelledby={headingId}
      className="flex h-full min-h-0 flex-col gap-3 animate-[rise-in_400ms_var(--ease-out-soft)_both]"
    >
      {/* Only the content scrolls; the actions stay visible. */}
      <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1">
        <header className="flex flex-col gap-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary-soft-ink">
            <Sparkles aria-hidden size={16} />
            {t.questionOf(index, INTERVIEW_LIMITS.maxQuestions)}
          </span>
          <h2
            id={headingId}
            className="text-2xl leading-tight font-semibold tracking-tight"
          >
            {question.text}
          </h2>
          {question.why && (
            <p className="flex items-start gap-2 rounded-2xl bg-primary-soft px-4 py-2.5 text-sm text-primary-soft-ink">
              <Lightbulb aria-hidden size={16} className="mt-0.5 shrink-0" />
              <span>
                <span className="sr-only">{t.why}: </span>
                {question.why}
              </span>
            </p>
          )}
        </header>

        {question.options.length > 0 && (
          <div
            role="group"
            aria-label={t.options}
            className="flex flex-wrap gap-2"
          >
            {question.options.map((option) => {
              const active = choices.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(option)}
                  className={cn(
                    "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium",
                    "ring-1 transition-[background-color,color,transform] duration-150 ease-out-soft ring-inset active:scale-[0.97]",
                    active
                      ? "bg-primary text-primary-ink ring-primary"
                      : "bg-surface-raised text-ink ring-line-strong hover:bg-surface-sunken",
                  )}
                >
                  {active && <Check aria-hidden size={16} />}
                  {option}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor={textId} className="text-sm font-medium">
            {t.otherLabel}
          </label>
          <input
            id={textId}
            value={text}
            maxLength={500}
            placeholder={t.otherPlaceholder}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSend) onAnswer({ choices, text });
            }}
            className="h-11 rounded-2xl bg-surface-sunken px-4 text-sm ring-1 ring-line ring-inset placeholder:text-ink-muted"
          />
        </div>
      </div>

      <footer className="flex justify-end gap-2 border-t border-line pt-3">
        <Button
          variant="ghost"
          icon={SkipForward}
          onClick={() => onAnswer(null)}
        >
          {t.skip}
        </Button>
        <Button
          icon={Send}
          disabled={!canSend}
          onClick={() => onAnswer({ choices, text })}
        >
          {t.send}
        </Button>
      </footer>
    </Card>
  );
}
