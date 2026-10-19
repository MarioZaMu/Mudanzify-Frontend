import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

interface StepDotsProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

/** Progress indicator; each dot is a button to jump to that step. */
export function StepDots({ total, current, onSelect }: StepDotsProps) {
  return (
    <ol className="flex items-center gap-2">
      {Array.from({ length: total }, (_, index) => {
        const active = index === current;
        return (
          <li key={index}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={es.onboarding.progress(index + 1, total)}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'block h-2 cursor-pointer rounded-full transition-all duration-300 ease-out-soft',
                active ? 'w-8 bg-ink' : index < current ? 'w-2 bg-ink/50' : 'w-2 bg-line-strong hover:bg-ink-muted',
              )}
            />
          </li>
        );
      })}
    </ol>
  );
}
