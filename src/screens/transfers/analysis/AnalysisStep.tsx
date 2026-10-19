import { ArrowRight, CheckCheck, CircleCheck, RotateCcw, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type {
  FindingDecision,
  Inventory,
  MappingDecision,
  PriorityDecision,
  TransferAnalysis,
} from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Tabs } from '@/components/ui/Tabs';
import { useAiStatus } from '@/hooks/useAiStatus';
import { es } from '@/i18n/es';
import { AiModeBadge } from '../interview/AiModeBadge';
import { FindingCard } from './FindingCard';
import { MappingCard } from './MappingCard';
import { PriorityList } from './PriorityList';

const t = es.workspace.analysis;

type Tab = 'findings' | 'mappings' | 'priority';

interface AnalysisStepProps {
  analysis: TransferAnalysis | null;
  inventory: Inventory;
  running: boolean;
  busy: boolean;
  onRun: () => void;
  onDecideFinding: (findingId: string, decision: FindingDecision) => void;
  onReviewMapping: (mappingId: string, decision: MappingDecision) => void;
  onSetPriority: (decision: PriorityDecision) => void;
  onConfirm: () => void;
  onRerun: () => void;
  onNext: () => void;
}

/** Step 5: local detection plus AI column mapping and priority, every item decided by the sender. */
export function AnalysisStep(props: AnalysisStepProps) {
  const { analysis, inventory, running, busy } = props;
  const aiStatus = useAiStatus();
  const [tab, setTab] = useState<Tab>('findings');
  const [confirming, setConfirming] = useState<'confirm' | 'rerun' | null>(null);
  const [includeRequest, setIncludeRequest] = useState<{ findingId: string; column: string; decision: FindingDecision } | null>(
    null,
  );
  const mode = analysis?.mode ?? aiStatus?.mode ?? 'demo';
  const model = aiStatus?.mode === 'ai' ? aiStatus.model : null;

  const header = (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {(analysis || aiStatus) && <AiModeBadge mode={mode} model={model} />}
      <p className="flex min-w-0 flex-1 items-center gap-2 text-xs text-ink-muted">
        <ShieldCheck aria-hidden size={14} className="shrink-0 text-risk-safe-ink" />
        {t.privacy}
      </p>
    </header>
  );

  if (!analysis) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        {header}
        <div className="grid flex-1 place-items-center">
          <div className="flex max-w-xl flex-col items-center gap-6 text-center">
            <span className="grid size-20 place-items-center rounded-[1.75rem] bg-primary text-primary-ink shadow-lifted animate-[float_5s_ease-in-out_infinite]">
              <ScanSearch aria-hidden size={36} />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-title">{t.title}</h2>
              <p className="text-lg text-ink-muted">{t.intro}</p>
            </div>
            <Button size="lg" icon={Sparkles} loading={running} onClick={props.onRun}>
              {t.start}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pendingFindings = analysis.findings.filter((finding) => finding.status === 'pending').length;
  const pendingMappings = analysis.mappings.filter((mapping) => mapping.status === 'pending').length;
  const pendingPriority = analysis.priority.status === 'pending';
  const pending = pendingFindings + pendingMappings + (pendingPriority ? 1 : 0);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {header}
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
        <Card variant="inverse" as="section" className="flex min-h-0 flex-col gap-4">
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
            <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-ink">
                <Sparkles aria-hidden size={18} />
              </span>
              {t.summaryTitle}
            </h2>
            <p className="text-sm opacity-85">{analysis.summary}</p>
          </div>
          {analysis.skippedTables.length > 0 && (
            <Alert tone="warn">{t.skipped(analysis.skippedTables.join(', '))}</Alert>
          )}

          <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-current/15 pt-4">
            {analysis.confirmed ? (
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 font-semibold">
                  <CircleCheck aria-hidden size={18} className="text-risk-safe" />
                  {t.confirmed}
                </p>
                <p className="text-sm opacity-80">{t.confirmedBody}</p>
                <p className="text-sm font-medium">{t.next}</p>
                <Button icon={ArrowRight} iconPosition="end" disabled={busy} className="self-start" onClick={props.onNext}>
                  {t.continue}
                </Button>
              </div>
            ) : (
              <Badge tone={pending > 0 ? 'accent' : 'primary'} className="w-fit">
                {pending > 0 ? t.pending(pending) : t.allDecided}
              </Badge>
            )}
            <div className="flex flex-wrap gap-2">
              {!analysis.confirmed && (
                <Button icon={CheckCheck} disabled={pending > 0 || busy} onClick={() => setConfirming('confirm')}>
                  {t.confirm}
                </Button>
              )}
              <Button variant="outline" icon={RotateCcw} disabled={busy} onClick={() => setConfirming('rerun')}>
                {t.rerun}
              </Button>
            </div>
          </div>
        </Card>

        <section className="flex min-h-0 flex-col gap-3">
          <Tabs
            label={t.tabs.label}
            idPrefix="analysis"
            activeId={tab}
            onChange={(id) => setTab(id as Tab)}
            items={[
              { id: 'findings', label: t.tabs.findings(pendingFindings) },
              { id: 'mappings', label: t.tabs.mappings(pendingMappings) },
              { id: 'priority', label: t.tabs.priority(pendingPriority) },
            ]}
          />
          <div
            id="analysis-panel"
            role="tabpanel"
            aria-labelledby={`analysis-tab-${tab}`}
            key={tab}
            className="flex min-h-0 flex-1 flex-col gap-3 animate-[rise-in_250ms_var(--ease-out-soft)_both]"
          >
            <p className="text-sm text-ink-muted">{t[tab].hint}</p>

            {tab === 'findings' &&
              (analysis.findings.length === 0 ? (
                <Alert tone="info">{t.findings.none}</Alert>
              ) : (
                <ul className="flex min-h-0 flex-col gap-3 overflow-y-auto p-1">
                  {analysis.findings.map((finding) => (
                    <li key={finding.id}>
                      <FindingCard
                        finding={finding}
                        inventory={inventory}
                        disabled={busy}
                        onDecide={(decision) => props.onDecideFinding(finding.id, decision)}
                        onIncludeSensitive={(decision) =>
                          setIncludeRequest({
                            findingId: finding.id,
                            column: finding.kind === 'sensitive-column' ? finding.column : '',
                            decision,
                          })
                        }
                      />
                    </li>
                  ))}
                </ul>
              ))}

            {tab === 'mappings' &&
              (analysis.mappings.length === 0 ? (
                <Alert tone="info">{t.mappings.none}</Alert>
              ) : (
                <ul className="flex min-h-0 flex-col gap-3 overflow-y-auto p-1">
                  {analysis.mappings.map((mapping) => (
                    <li key={mapping.id}>
                      <MappingCard
                        mapping={mapping}
                        inventory={inventory}
                        disabled={busy}
                        onReview={(decision) => props.onReviewMapping(mapping.id, decision)}
                      />
                    </li>
                  ))}
                </ul>
              ))}

            {tab === 'priority' && (
              <PriorityList priority={analysis.priority} disabled={busy} onDecide={props.onSetPriority} />
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirming !== null}
        title={confirming === 'confirm' ? t.confirmTitle : t.rerunTitle}
        description={confirming === 'confirm' ? t.confirmBody : t.rerunBody}
        confirmLabel={confirming === 'confirm' ? t.confirm : t.rerun}
        onConfirm={() => {
          if (confirming === 'confirm') props.onConfirm();
          else props.onRerun();
          setConfirming(null);
        }}
        onCancel={() => setConfirming(null)}
      />
      <ConfirmDialog
        open={includeRequest !== null}
        tone="danger"
        title={t.findings.includeTitle}
        description={includeRequest ? t.findings.includeBody(includeRequest.column) : ''}
        confirmLabel={t.findings.includeConfirm}
        acknowledgement={t.findings.includeAck}
        onConfirm={() => {
          if (includeRequest) props.onDecideFinding(includeRequest.findingId, includeRequest.decision);
          setIncludeRequest(null);
        }}
        onCancel={() => setIncludeRequest(null)}
      />
    </div>
  );
}
