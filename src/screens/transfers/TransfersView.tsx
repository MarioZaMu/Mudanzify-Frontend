import { ArrowRight, Boxes, FolderOpen, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { TransferSummary } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { useTransfers } from '@/hooks/useTransfers';
import { es } from '@/i18n/es';
import { formatBytes, formatNumber, formatRelative } from '@/lib/format';

const t = es.transfers;

interface TransfersViewProps {
  onOpen: (id: string) => void;
}

/** Saved transfer drafts. Deleting one removes only Mudanzify's record. */
export function TransfersView({ onOpen }: TransfersViewProps) {
  const { state, create, remove } = useTransfers();
  const [creating, setCreating] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<TransferSummary | null>(null);
  const [failed, setFailed] = useState(false);

  const onCreate = async () => {
    setCreating(true);
    setFailed(false);
    try {
      const draft = await create();
      if (draft) onOpen(draft.id);
    } catch {
      setFailed(true);
    } finally {
      setCreating(false);
    }
  };

  const onConfirmRemoval = async () => {
    if (!pendingRemoval) return;
    const target = pendingRemoval;
    setPendingRemoval(null);
    try {
      await remove(target.id);
    } catch {
      setFailed(true);
    }
  };

  const items = state.status === 'ready' ? state.items : [];

  return (
    <div className="enter-stagger flex h-full flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Badge tone="inverse" className="w-fit">
            {es.nav.transfers}
          </Badge>
          <h1 className="text-display">{t.title}</h1>
          <p className="max-w-xl text-lg text-ink-muted">{t.intro}</p>
        </div>
        <Button
          size="lg"
          icon={Plus}
          loading={creating}
          disabled={state.status !== 'ready'}
          onClick={() => void onCreate()}
        >
          {t.create}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {failed && <Alert tone="danger">{t.errors.generic}</Alert>}
        {state.status === 'browser-only' && (
          <Alert tone="warn" title={es.connection.browserOnly}>
            {t.browserOnly}
          </Alert>
        )}
        {state.status === 'error' && <Alert tone="danger">{t.errors.generic}</Alert>}

        {state.status === 'ready' && items.length === 0 && (
          <Card variant="sunken" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-box text-box-ink ring-1 ring-box-line">
              <Boxes aria-hidden size={28} />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">{t.empty.title}</h2>
              <p className="max-w-sm text-ink-muted">{t.empty.body}</p>
            </div>
          </Card>
        )}

        {items.length > 0 && (
          <ul className="grid min-h-0 auto-rows-min gap-4 overflow-y-auto p-1 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <li key={item.id}>
                <TransferCard item={item} onOpen={() => onOpen(item.id)} onRemove={() => setPendingRemoval(item)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        tone="danger"
        title={pendingRemoval ? t.remove.title(pendingRemoval.name) : ''}
        description={t.remove.body}
        confirmLabel={t.remove.confirm}
        onConfirm={() => void onConfirmRemoval()}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}

function TransferCard({
  item,
  onOpen,
  onRemove,
}: {
  item: TransferSummary;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const s = t.summary;

  return (
    <Card as="article" className="flex h-full flex-col gap-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-lg font-semibold">{item.name}</h2>
          <p className="text-xs text-ink-muted">{s.updated(formatRelative(item.updatedAt))}</p>
        </div>
        <IconButton icon={Trash2} label={t.remove.label} variant="ghost" size="sm" onClick={onRemove} />
      </header>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <FolderOpen aria-hidden size={16} className="text-ink-muted" />
          <dt className="sr-only">{es.workspace.steps.origin}</dt>
          <dd>{s.sources(item.sourceCount)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Boxes aria-hidden size={16} className="text-ink-muted" />
          <dt className="sr-only">{es.workspace.steps.inventory}</dt>
          <dd>
            {item.fileCount === null
              ? s.noInventory
              : `${s.files(formatNumber(item.fileCount))} · ${formatBytes(item.totalBytes ?? 0)}`}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin aria-hidden size={16} className="text-ink-muted" />
          <dt className="sr-only">{es.workspace.steps.destination}</dt>
          <dd>{item.hasDestination ? s.destinationReady : s.destinationMissing}</dd>
        </div>
      </dl>

      <Button variant="outline" icon={ArrowRight} iconPosition="end" className="mt-auto self-start" onClick={onOpen}>
        {t.open}
      </Button>
    </Card>
  );
}

