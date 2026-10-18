import { AiSuggestion } from '@/components/ui/AiSuggestion';
import { es } from '@/i18n/es';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.ai;

export function AiSection() {
  return (
    <ShowcaseSection id="ai" title={t.title} description={t.description}>
      <div className="grid gap-4 md:grid-cols-2">
        <AiSuggestion title={t.suggestion.title} body={t.suggestion.body} />
        <AiSuggestion title={t.duplicate.title} body={t.duplicate.body} />
      </div>
    </ShowcaseSection>
  );
}
