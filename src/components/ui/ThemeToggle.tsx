import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '@/bridge';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme/ThemeProvider';

const OPTIONS = [
  { value: 'light', icon: Sun, label: es.theme.light },
  { value: 'dark', icon: Moon, label: es.theme.dark },
  { value: 'system', icon: Monitor, label: es.theme.system },
] as const satisfies ReadonlyArray<{ value: ThemePreference; icon: unknown; label: string }>;

/** Segmented control built on native radios, so arrow keys work out of the box. */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className={cn('flex rounded-full bg-surface-sunken p-1', className)}>
      <legend className="sr-only">{es.theme.label}</legend>
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <label
          key={value}
          title={label}
          className={cn(
            'relative grid h-8 flex-1 cursor-pointer place-items-center rounded-full px-3 text-ink-muted',
            'transition-colors duration-150 has-checked:bg-surface-raised has-checked:text-ink has-checked:shadow-soft',
            'has-focus-visible:outline-2 has-focus-visible:outline-ink',
          )}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={preference === value}
            onChange={() => setPreference(value)}
            className="sr-only"
          />
          <Icon aria-hidden size={16} />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
