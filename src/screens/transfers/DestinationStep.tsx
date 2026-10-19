import { CircleCheck, CircleX, FolderInput, HardDrive, Lock, Sparkles } from 'lucide-react';
import type { TransferDraft } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';
import { formatBytes, formatNumber } from '@/lib/format';

const t = es.workspace.destination;

interface DestinationStepProps {
  draft: TransferDraft;
  busy: boolean;
  onPick: () => void;
}

/** Step 3: the sender picks where the data goes. Nothing is written yet. */
export function DestinationStep({ draft, busy, onPick }: DestinationStepProps) {
  const { destination, inventory } = draft;
  const ready = destination !== null && inventory !== null && destination.conflicts.length === 0;

  return (
    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <section className="flex min-h-0 flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h2 className="text-title">{t.title}</h2>
          <p className="max-w-prose text-ink-muted">{t.body}</p>
        </header>

        <Card className="flex flex-col gap-5">
          {destination ? (
            <div className="flex items-center gap-4 animate-[rise-in_300ms_var(--ease-out-soft)_both]">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-box text-box-ink ring-1 ring-box-line">
                <FolderInput aria-hidden size={22} />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-lg font-semibold">{destination.name}</span>
                <span className="truncate font-mono text-xs text-ink-muted" title={destination.path}>
                  {destination.path}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-ink-muted">{t.pick}</p>
          )}

          {destination && (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-sunken p-3">
                {destination.writable ? (
                  <CircleCheck aria-hidden size={20} className="text-risk-safe-ink" />
                ) : (
                  <CircleX aria-hidden size={20} className="text-risk-danger-ink" />
                )}
                <dt className="sr-only">{t.writable}</dt>
                <dd className="text-sm font-medium">{destination.writable ? t.writable : t.notWritable}</dd>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface-sunken p-3">
                <HardDrive aria-hidden size={20} className="text-ink-muted" />
                <dt className="sr-only">{t.space}</dt>
                <dd className="flex flex-col text-sm">
                  <span className="font-medium">
                    {destination.freeBytes === null ? t.unknownSpace : t.free(formatBytes(destination.freeBytes))}
                  </span>
                  {inventory && (
                    <span className="text-xs text-ink-muted">{t.required(formatBytes(inventory.totals.bytes))}</span>
                  )}
                </dd>
              </div>
            </dl>
          )}

          <Button
            variant={destination ? 'outline' : 'primary'}
            icon={FolderInput}
            loading={busy}
            className="self-start"
            onClick={onPick}
          >
            {destination ? t.change : t.pick}
          </Button>
        </Card>

        {destination?.conflicts.map((conflict) => (
          <Alert key={conflict} tone="danger">
            {t.conflicts[conflict]}
          </Alert>
        ))}
        {!inventory && <Alert tone="warn">{t.needsInventory}</Alert>}
      </section>

      <Card
        variant={ready ? 'inverse' : 'sunken'}
        className="flex flex-col justify-between gap-6 transition-colors duration-300"
      >
        <div className="flex flex-col gap-3">
          <span
            className={
              ready
                ? 'grid size-12 place-items-center rounded-2xl bg-primary text-primary-ink'
                : 'grid size-12 place-items-center rounded-2xl bg-surface-raised text-ink-muted'
            }
          >
            <Sparkles aria-hidden size={22} />
          </span>
          <h2 className="text-title">{t.ready.title}</h2>
          <p className={ready ? 'opacity-80' : 'text-ink-muted'}>{t.ready.body}</p>
        </div>

        <dl className="flex flex-col gap-2 text-sm">
          <SummaryRow label={es.workspace.steps.origin} value={es.transfers.summary.sources(draft.sources.length)} />
          <SummaryRow
            label={es.workspace.steps.inventory}
            value={
              inventory
                ? `${es.transfers.summary.files(formatNumber(inventory.totals.files))} · ${formatBytes(inventory.totals.bytes)}`
                : es.transfers.summary.noInventory
            }
          />
          <SummaryRow
            label={es.workspace.steps.destination}
            value={destination?.name ?? es.transfers.summary.destinationMissing}
          />
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-4">
          <p className="text-sm font-medium">{t.ready.next}</p>
          <Badge icon={Lock}>{t.ready.soon}</Badge>
        </div>
      </Card>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="opacity-70">{label}</dt>
      <dd className="truncate text-right font-medium">{value}</dd>
    </div>
  );
}
