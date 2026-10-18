import { Card } from '@/components/ui/Card';
import { RiskBadge, RiskLight, type RiskLevel } from '@/components/ui/RiskBadge';
import { es } from '@/i18n/es';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.risk;
const LEVELS: RiskLevel[] = ['safe', 'warn', 'danger'];

export function RiskSection() {
  return (
    <ShowcaseSection id="risk" title={t.title} description={t.description}>
      <div className="grid gap-4 md:grid-cols-3">
        {LEVELS.map((level) => (
          <Card key={level} className="flex items-center gap-5">
            <RiskLight level={level} />
            <div className="flex flex-col items-start gap-2">
              <RiskBadge level={level} />
              <p className="text-sm text-ink-muted">{es.risk[level].description}</p>
            </div>
          </Card>
        ))}
      </div>
    </ShowcaseSection>
  );
}
