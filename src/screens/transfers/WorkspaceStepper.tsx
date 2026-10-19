import { Check } from 'lucide-react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

export const WORKSPACE_STEPS = ['origin', 'inventory', 'destination', 'interview', 'analysis', 'execution'] as const;
export type WorkspaceStep = (typeof WORKSPACE_STEPS)[number];

interface WorkspaceStepperProps {
  active: WorkspaceStep;
  completed: Record<WorkspaceStep, boolean>;
  available: Record<WorkspaceStep, boolean>;
  onSelect: (step: WorkspaceStep) => void;
}

/** Numbered pill steps: Origen → Inventario → Destino → Entrevista IA → Revisión IA → Traspaso. */
export function WorkspaceStepper({ active, completed, available, onSelect }: WorkspaceStepperProps) {
  return (
    <nav aria-label={es.workspace.steps.label}>
      <ol className="flex items-center gap-2 rounded-full bg-surface-sunken p-1.5">
        {WORKSPACE_STEPS.map((step, index) => {
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
                {es.workspace.steps[step]}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
