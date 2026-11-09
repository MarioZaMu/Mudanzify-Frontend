import { AiSuggestion } from '@/components/ui/AiSuggestion';
import { strings } from '@/i18n';
import { ShowcaseSection } from './ShowcaseSection';

const t = strings.showcase.sections.ai;

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
