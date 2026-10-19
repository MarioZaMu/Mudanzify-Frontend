import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.colors;

const SWATCHES = [
  { label: t.swatches.primary, token: 'primary', className: 'bg-primary' },
  { label: t.swatches.kraft, token: 'kraft-500', className: 'bg-kraft-500' },
  { label: t.swatches.accent, token: 'accent', className: 'bg-accent' },
  { label: t.swatches.surface, token: 'surface', className: 'bg-surface ring-1 ring-line ring-inset' },
  { label: t.swatches.ink, token: 'ink', className: 'bg-ink' },
  { label: t.swatches.safe, token: 'risk-safe', className: 'bg-risk-safe' },
  { label: t.swatches.warn, token: 'risk-warn', className: 'bg-risk-warn' },
  { label: t.swatches.danger, token: 'risk-danger', className: 'bg-risk-danger' },
];

const KRAFT_SCALE = [
  ['50', 'bg-kraft-50'],
  ['100', 'bg-kraft-100'],
  ['200', 'bg-kraft-200'],
  ['300', 'bg-kraft-300'],
  ['400', 'bg-kraft-400'],
  ['500', 'bg-kraft-500'],
  ['600', 'bg-kraft-600'],
  ['700', 'bg-kraft-700'],
  ['800', 'bg-kraft-800'],
  ['900', 'bg-kraft-900'],
] as const;

export function ColorsSection() {
  return (
    <ShowcaseSection id="colors" title={t.title} description={t.description}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SWATCHES.map(({ label, token, className }) => (
          <Card key={token} as="div" className="flex flex-col gap-3 p-3">
            <span className={cn('h-14 rounded-2xl', className)} />
            <span className="flex flex-col px-1 pb-1">
              <span className="text-sm font-medium">{label}</span>
              <code className="font-mono text-xs text-ink-muted">{token}</code>
            </span>
          </Card>
        ))}
      </div>

      <Card as="div" className="flex flex-col gap-3">
        <span className="text-sm font-medium text-ink-muted">{t.kraftScale}</span>
        <div className="grid grid-cols-10 gap-2">
          {KRAFT_SCALE.map(([step, className]) => (
            <div key={step} className="flex flex-col gap-1.5">
              <span className={cn('h-12 rounded-xl', className)} />
              <code className="text-center font-mono text-xs text-ink-muted">{step}</code>
            </div>
          ))}
        </div>
      </Card>
    </ShowcaseSection>
  );
}
