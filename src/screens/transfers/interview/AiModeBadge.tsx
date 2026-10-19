import { FlaskConical, Sparkles } from 'lucide-react';
import type { AiMode } from '@/bridge';
import { Badge } from '@/components/ui/Badge';
import { es } from '@/i18n/es';

const t = es.workspace.interview.mode;

/** Always tells the user whether the answers come from the real AI or the demo script. */
export function AiModeBadge({ mode, model }: { mode: AiMode; model: string | null }) {
  return mode === 'ai' ? (
    <Badge tone="primary" icon={Sparkles}>
      {t.ai(model ?? 'Claude')}
    </Badge>
  ) : (
    <span title={t.demoHint}>
      <Badge tone="accent" icon={FlaskConical}>
        {t.demo}
      </Badge>
    </span>
  );
}
