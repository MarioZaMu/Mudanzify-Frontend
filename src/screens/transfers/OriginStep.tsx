import { ArrowRight, File, FilePlus2, Folder, FolderPlus, ScanSearch, X, type LucideIcon } from 'lucide-react';
import type { SourceKind, TransferDraft } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { es } from '@/i18n/es';

const t = es.workspace.origin;

interface OriginStepProps {
  draft: TransferDraft;
  busy: boolean;
  onAdd: (kind: SourceKind) => void;
  onRemove: (sourceId: string) => void;
  onScan: () => void;
  onViewInventory: () => void;
}

/** Step 1: choose what to move. Paths always come from the native dialog. */
export function OriginStep({ draft, busy, onAdd, onRemove, onScan, onViewInventory }: OriginStepProps) {
  const hasSources = draft.sources.length > 0;
  const hasInventory = draft.inventory !== null;

  return (
    <div className="grid h-full min-h-0 gap-6 @3xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className="flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h2 className="text-title">{t.title}</h2>
          <p className="text-ink-muted">{t.body}</p>
        </header>
        <ChoiceCard icon={FolderPlus} title={t.addFolder.title} body={t.addFolder.body} disabled={busy} onClick={() => onAdd('folder')} />
        <ChoiceCard icon={FilePlus2} title={t.addFiles.title} body={t.addFiles.body} disabled={busy} onClick={() => onAdd('file')} />
        <Alert tone="info" className="mt-auto">
          {es.workspace.readOnlyNote}
        </Alert>
      </section>

      <Card className="flex min-h-0 flex-col gap-4">
        <h3 className="text-lg font-semibold">{t.listTitle}</h3>

        {hasSources ? (
          <ul className="-mx-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2">
            {draft.sources.map((source) => {
              const Icon = source.kind === 'folder' ? Folder : File;
              return (
                <li
                  key={source.id}
                  className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-surface-sunken animate-[rise-in_300ms_var(--ease-out-soft)_both]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-box text-box-ink ring-1 ring-box-line">
                    <Icon aria-hidden size={18} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{source.name}</span>
                    <span className="truncate font-mono text-xs text-ink-muted" title={source.path}>
                      {t.kind[source.kind]} · {source.path}
                    </span>
                  </div>
                  <IconButton
                    icon={X}
                    label={t.remove(source.name)}
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => onRemove(source.id)}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid flex-1 place-items-center rounded-2xl border-2 border-dashed border-line-strong p-6 text-center text-ink-muted">
            {t.empty}
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
          {hasInventory ? (
            <>
              <Button variant="ghost" icon={ScanSearch} disabled={busy} onClick={onScan}>
                {t.rescan}
              </Button>
              <Button icon={ArrowRight} iconPosition="end" disabled={busy} onClick={onViewInventory}>
                {t.viewInventory}
              </Button>
            </>
          ) : (
            <Button icon={ScanSearch} disabled={!hasSources || busy} onClick={onScan}>
              {t.scan}
            </Button>
          )}
        </footer>
      </Card>
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  body,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-4 rounded-card bg-surface-raised p-5 text-left shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-0.5 hover:shadow-lifted disabled:pointer-events-none disabled:opacity-45"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-inverse text-ink-inverse transition-transform duration-200 group-hover:scale-105">
        <Icon aria-hidden size={22} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-ink-muted">{body}</span>
      </span>
    </button>
  );
}
