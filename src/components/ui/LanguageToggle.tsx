import { LANGUAGES } from '@/bridge';
import { strings } from '@/i18n';
import { useLanguage } from '@/language/LanguageProvider';
import { cn } from '@/lib/cn';

const SHORT = { es: 'ES', en: 'EN' } as const;

/** Segmented ES | EN switch built on native radios, like the theme toggle. */
export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <fieldset className={cn('flex rounded-full bg-surface-sunken p-1', className)}>
      <legend className="sr-only">{strings.language.label}</legend>
      {LANGUAGES.map((value) => (
        <label
          key={value}
          title={strings.language[value]}
          className={cn(
            'relative grid h-8 flex-1 cursor-pointer place-items-center rounded-full px-3 text-xs font-semibold text-ink-muted',
            'transition-colors duration-150 has-checked:bg-surface-raised has-checked:text-ink has-checked:shadow-soft',
            'has-focus-visible:outline-2 has-focus-visible:outline-ink',
          )}
        >
          <input
            type="radio"
            name="language"
            value={value}
            checked={language === value}
            onChange={() => setLanguage(value)}
            className="sr-only"
          />
          <span aria-hidden>{SHORT[value]}</span>
          <span className="sr-only">{strings.language[value]}</span>
        </label>
      ))}
    </fieldset>
  );
}
