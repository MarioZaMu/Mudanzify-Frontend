import { CircleCheck, Copy, FileText, Folder, FolderPlus, HardDrive, Lock, Minus, Wand2, type LucideIcon } from 'lucide-react';
import type { ExecutionPlan, PlanAction, PlanItem, TableChange, TransferDraft } from '@/bridge';
import { Card } from '@/components/ui/Card';
import { KIND_ICONS } from '@/components/ui/DataBox';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatBytes } from '@/lib/format';
import { categoryName, fileName } from '../analysis/describe';
import { CATEGORY_BOX_KIND } from '../categories';

const t = es.workspace.execution;

const ACTION_STYLE: Record<PlanAction, { icon: LucideIcon; className: string }> = {
  copy: { icon: Copy, className: 'bg-risk-safe-soft text-risk-safe-ink' },
  transform: { icon: Wand2, className: 'bg-primary-soft text-primary-soft-ink' },
  skip: { icon: Minus, className: 'bg-surface-sunken text-ink-muted' },
};

export function describeChange(change: TableChange): string {
  switch (change.kind) {
    case 'mask':
      return t.plan.changes.mask(change.column);
    case 'drop-column':
      return t.plan.changes['drop-column'](change.column);
    case 'remove-duplicates':
      return t.plan.changes['remove-duplicates'](change.rows);
    case 'rename':
      return t.plan.changes.rename(change.column, change.to);
  }
}

function PanelTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">
      <Icon aria-hidden size={16} />
      {children}
    </h2>
  );
}

/** Left panel: what is read. */
export function OriginPanel({ draft }: { draft: TransferDraft }) {
  const inventory = draft.inventory!;
  return (
    <Card as="section" className="flex min-h-0 flex-col gap-4">
      <PanelTitle icon={Folder}>{t.panels.origin}</PanelTitle>
      <ul className="flex flex-col gap-2">
        {draft.sources.map((source) => (
          <li key={source.id} className="flex items-center gap-3 rounded-2xl bg-surface-sunken p-3">
            {source.kind === 'folder' ? <Folder aria-hidden size={18} /> : <FileText aria-hidden size={18} />}
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium" title={source.path}>
                {source.name}
              </span>
              <span className="text-xs text-ink-muted">{source.kind === 'folder' ? t.origin.folder : t.origin.file}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        {inventory.boxes.map((box) => {
          const Icon = KIND_ICONS[CATEGORY_BOX_KIND[box.id]];
          return (
            <li key={box.id} className="flex items-center gap-3 px-1 py-1.5">
              <Icon aria-hidden size={16} className="shrink-0 text-box-ink" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{categoryName(box.id)}</span>
                <span className="text-xs text-ink-muted tabular-nums">
                  {t.plan.box(box.fileCount)} · {formatBytes(box.bytes)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto flex items-start gap-2 rounded-2xl bg-risk-safe-soft p-3 text-xs font-medium text-risk-safe-ink">
        <Lock aria-hidden size={14} className="mt-0.5 shrink-0" />
        {t.origin.readOnly}
      </p>
    </Card>
  );
}

function PlanRow({ item, name, processed }: { item: PlanItem; name: string; processed: boolean }) {
  const { icon: Icon, className } = ACTION_STYLE[item.action];
  const detail = item.reason ? t.plan.reasons[item.reason] : item.changes.map(describeChange).join(' · ');
  return (
    <li className={cn('flex flex-col gap-1 rounded-xl px-2 py-2', item.action === 'skip' && 'opacity-70')}>
      <div className="flex items-center gap-2">
        <span className={cn('min-w-0 flex-1 truncate text-sm', item.action === 'skip' && 'line-through')} title={name}>
          {name}
        </span>
        {processed && <CircleCheck aria-label={t.running.processed} size={16} className="shrink-0 text-risk-safe-ink" />}
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={cn('inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2 text-xs font-semibold', className)}>
          <Icon aria-hidden size={12} />
          {t.plan.actions[item.action]}
        </span>
        {detail && <span className="text-xs text-ink-muted">{detail}</span>}
      </div>
    </li>
  );
}

/** Middle panel: every file grouped by box, in packing order, with what will happen to it. */
export function PlanPanel({ draft, plan, done }: { draft: TransferDraft; plan: ExecutionPlan; done: number | null }) {
  const inventory = draft.inventory!;
  const position = new Map(plan.items.map((item, index) => [item.fileId, index]));

  return (
    <Card as="section" className="flex min-h-0 flex-col gap-4 ring-2 ring-primary/30">
      <PanelTitle icon={Wand2}>{t.panels.plan}</PanelTitle>
      <ol className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
        {plan.order.map((category, index) => {
          const items = plan.items.filter((item) => item.category === category);
          const Icon = KIND_ICONS[CATEGORY_BOX_KIND[category]];
          return (
            <li key={category} className="flex flex-col gap-1">
              <h3 className="flex items-center gap-3">
                <span className="w-5 text-center font-mono text-xs text-ink-muted">{index + 1}</span>
                <span className="grid size-8 place-items-center rounded-lg bg-box text-box-ink ring-1 ring-box-line">
                  <Icon aria-hidden size={16} />
                </span>
                <span className="flex-1 font-semibold">{categoryName(category)}</span>
                <span className="text-xs text-ink-muted">{t.plan.box(items.length)}</span>
              </h3>
              <ul className="ml-8 flex flex-col">
                {items.map((item) => (
                  <PlanRow
                    key={item.fileId}
                    item={item}
                    name={fileName(inventory, item.fileId)}
                    processed={done !== null && (position.get(item.fileId) ?? Infinity) < done}
                  />
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/** Right panel: the new folder and what it will contain. */
export function DestinationPanel({ draft, plan }: { draft: TransferDraft; plan: ExecutionPlan }) {
  const destination = draft.destination!;
  const targets = plan.items.filter((item) => item.target).map((item) => item.target!);
  // Every folder level, so the tree shows parents even when they hold no file directly.
  const folders = [
    ...new Set(
      targets.flatMap((target) => {
        const parts = target.split('/').slice(0, -1);
        return parts.map((_, index) => parts.slice(0, index + 1).join('/'));
      }),
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'));

  return (
    <Card as="section" className="flex min-h-0 flex-col gap-4">
      <PanelTitle icon={HardDrive}>{t.panels.destination}</PanelTitle>
      <div className="flex flex-col gap-1">
        <span className="truncate font-medium" title={destination.path}>
          {destination.path}
        </span>
        {destination.freeBytes !== null && (
          <span className="text-xs text-ink-muted">{t.destination.free(formatBytes(destination.freeBytes))}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-surface-sunken p-3">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <FolderPlus aria-hidden size={16} className="text-primary" />
          {plan.outputName}
        </span>
        <span className="text-xs text-ink-muted">{t.destination.newFolderHint}</span>
      </div>
      <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto font-mono text-xs">
        {folders.map((folder) => (
          <li
            key={folder}
            className="flex items-center gap-2 truncate"
            style={{ paddingLeft: `${(folder.split('/').length - 1) * 12}px` }}
            title={folder}
          >
            <Folder aria-hidden size={13} className="shrink-0 text-box-ink" />
            {folder.split('/').at(-1)}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <FileText aria-hidden size={13} className="shrink-0 text-primary" />
          {t.destination.report}
        </li>
      </ul>
    </Card>
  );
}
