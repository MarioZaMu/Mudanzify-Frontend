import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PillStepperProps<Step extends string> {
  steps: readonly Step[];
  labels: Record<Step, string>;
  /** Accessible name of the navigation. */
  label: string;
  active: Step;
  completed: Record<Step, boolean>;
  available: Record<Step, boolean>;
  onSelect: (step: Step) => void;
}

/** Numbered pill steps; a finished step shows a check, a locked one is disabled. */
export function PillStepper<Step extends string>({
  steps,
  labels,
  label,
  active,
  completed,
  available,
  onSelect,
}: PillStepperProps<Step>) {
  return (
    <nav aria-label={label}>
      <ol className="flex items-center gap-2 rounded-full bg-surface-sunken p-1.5">
        {steps.map((step, index) => {
          const isActive = step === active;
          const isDone = completed[step];
          return (
            <li key={step}>
              <button
                type="button"
                disabled={!available[step]}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => onSelect(step)}
                className={cn(
                  'flex h-10 cursor-pointer items-center gap-2 rounded-full pr-4 pl-1.5 text-sm font-medium',
                  'transition-[background-color,color,box-shadow] duration-200 ease-out-soft',
                  'disabled:cursor-not-allowed disabled:opacity-45',
                  isActive ? 'bg-surface-inverse text-ink-inverse shadow-soft' : 'text-ink hover:bg-surface-raised',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 place-items-center rounded-full font-mono text-xs',
                    isActive ? 'bg-ink-inverse/15' : isDone ? 'bg-risk-safe-soft text-risk-safe-ink' : 'bg-surface-raised',
                  )}
                >
                  {isDone && !isActive ? <Check aria-hidden size={14} strokeWidth={2.5} /> : index + 1}
                </span>
                {labels[step]}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
