import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '@/bridge';
import { strings } from '@/i18n';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme/ThemeProvider';

const options = () => [
  { value: 'light', icon: Sun, label: strings.theme.light },
  { value: 'dark', icon: Moon, label: strings.theme.dark },
  { value: 'system', icon: Monitor, label: strings.theme.system },
] as const satisfies ReadonlyArray<{ value: ThemePreference; icon: unknown; label: string }>;

/** Segmented control built on native radios, so arrow keys work out of the box. */
export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className={cn('flex rounded-full bg-surface-sunken p-1', className)}>
      <legend className="sr-only">{strings.theme.label}</legend>
      {options().map(({ value, icon: Icon, label }) => (
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
