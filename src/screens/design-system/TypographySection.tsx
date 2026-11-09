import { Card } from '@/components/ui/Card';
import { strings } from '@/i18n';
import { ShowcaseSection } from './ShowcaseSection';

const t = strings.showcase.sections.typography;

const specimens = () => [
  { token: 'text-display', sample: t.display, className: 'text-display' },
  { token: 'text-title', sample: t.titleSample, className: 'text-title' },
  { token: 'text-base', sample: t.body, className: 'text-base max-w-prose' },
  { token: 'text-sm · ink-muted', sample: t.caption, className: 'text-sm text-ink-muted' },
  { token: 'font-mono', sample: t.mono, className: 'font-mono text-sm' },
];

export function TypographySection() {
  return (
    <ShowcaseSection id="typography" title={t.title} description={t.description}>
      <Card className="flex flex-col divide-y divide-line py-2">
        {specimens().map(({ token, sample, className }) => (
          <div key={token} className="grid items-baseline gap-2 py-5 md:grid-cols-[10rem_1fr]">
            <code className="font-mono text-xs text-ink-muted">{token}</code>
            <p className={className}>{sample}</p>
          </div>
        ))}
      </Card>
    </ShowcaseSection>
  );
}
