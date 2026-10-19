import { ArrowRight, CircleAlert, CircleCheck, Clock, FolderInput, Inbox, PackageCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ReceptionSummary } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { useReceptions } from '@/hooks/useReceptions';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatNumber, formatRelative } from '@/lib/format';

const t = es.receptions;

interface ReceptionsViewProps {
  onOpen: (id: string) => void;
}

/** Received folders. Removing one forgets it here; the folder stays untouched. */
export function ReceptionsView({ onOpen }: ReceptionsViewProps) {
  const { state, open, remove } = useReceptions();
  const [opening, setOpening] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<ReceptionSummary | null>(null);
  const [error, setError] = useState<'generic' | 'noManifest' | null>(null);

  const onOpenFolder = async () => {
    setOpening(true);
    setError(null);
    try {
      const reception = await open();
      if (reception) onOpen(reception.id);
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : '';
      setError(message.includes('RECEPTION_NO_MANIFEST') ? 'noManifest' : 'generic');
    } finally {
      setOpening(false);
    }
  };

  const onConfirmRemoval = async () => {
    if (!pendingRemoval) return;
    const target = pendingRemoval;
    setPendingRemoval(null);
    try {
      await remove(target.id);
    } catch {
      setError('generic');
    }
  };

  const items = state.status === 'ready' ? state.items : [];

  return (
    <div className="enter-stagger flex h-full flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Badge tone="inverse" className="w-fit">
            {es.nav.receptions}
          </Badge>
          <h1 className="text-display">{t.title}</h1>
          <p className="max-w-xl text-lg text-ink-muted">{t.intro}</p>
        </div>
        <Button
          size="lg"
          icon={FolderInput}
          loading={opening}
          disabled={state.status !== 'ready'}
          onClick={() => void onOpenFolder()}
        >
          {t.open}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {error && <Alert tone="danger">{t.errors[error]}</Alert>}
        {state.status === 'browser-only' && (
          <Alert tone="warn" title={es.connection.browserOnly}>
            {t.browserOnly}
          </Alert>
        )}
        {state.status === 'error' && <Alert tone="danger">{t.errors.generic}</Alert>}

        {state.status === 'ready' && items.length === 0 && (
          <Card variant="sunken" className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-box text-box-ink ring-1 ring-box-line">
              <Inbox aria-hidden size={28} />
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
                <ReceptionCard item={item} onOpen={() => onOpen(item.id)} onRemove={() => setPendingRemoval(item)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title={pendingRemoval ? t.remove.title(pendingRemoval.transferName) : ''}
        description={t.remove.body}
        confirmLabel={t.remove.confirm}
        onConfirm={() => void onConfirmRemoval()}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}

function ReceptionCard({
  item,
  onOpen,
  onRemove,
}: {
  item: ReceptionSummary;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const c = t.card;
  const verification = !item.verifiedAt
    ? { icon: Clock, text: c.notVerified, className: 'text-ink-muted' }
    : item.issues > 0
      ? { icon: CircleAlert, text: `${c.verified} · ${c.issues(item.issues)}`, className: 'text-risk-danger-ink' }
      : { icon: CircleCheck, text: c.verified, className: 'text-risk-safe-ink' };
  const VerificationIcon = verification.icon;
  const ConfirmIcon = item.confirmedAt ? PackageCheck : Clock;

  return (
    <Card as="article" className="flex h-full flex-col gap-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate text-lg font-semibold">{item.transferName}</h2>
          <p className="truncate text-xs text-ink-muted">
            {item.folderName} · {c.opened(formatRelative(item.openedAt))}
          </p>
        </div>
        <IconButton icon={Trash2} label={t.remove.label} variant="ghost" size="sm" onClick={onRemove} />
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-center gap-2">
          <Inbox aria-hidden size={16} className="text-ink-muted" />
          {c.files(formatNumber(item.files))}
        </li>
        <li className={cn('flex items-center gap-2', verification.className)}>
          <VerificationIcon aria-hidden size={16} />
          {verification.text}
        </li>
        <li className={cn('flex items-center gap-2', item.confirmedAt ? 'text-risk-safe-ink' : 'text-ink-muted')}>
          <ConfirmIcon aria-hidden size={16} />
          {item.confirmedAt ? c.confirmed : c.pending}
        </li>
      </ul>

      <Button variant="outline" icon={ArrowRight} iconPosition="end" className="mt-auto self-start" onClick={onOpen}>
        {c.open}
      </Button>
    </Card>
  );
}
