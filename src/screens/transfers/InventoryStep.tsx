import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { FileCategory, Inventory } from '@/bridge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataBox } from '@/components/ui/DataBox';
import { es } from '@/i18n/es';
import { formatBytes, formatNumber } from '@/lib/format';
import { CATEGORY_BOX_KIND } from './categories';
import { InventoryDetail } from './InventoryDetail';

const t = es.workspace.inventory;

interface InventoryStepProps {
  inventory: Inventory;
  onNext: () => void;
}

/** Step 2: what the sources contain, grouped into labeled boxes. */
export function InventoryStep({ inventory, onNext }: InventoryStepProps) {
  const [selected, setSelected] = useState<FileCategory | null>(inventory.boxes[0]?.id ?? null);
  const unreadable = inventory.issues.filter((issue) => issue.kind === 'unreadable').length;
  const tableIssues = inventory.issues.filter(
    (issue) => issue.kind === 'table-too-large' || issue.kind === 'table-unreadable',
  ).length;

  const stats = [
    { label: t.stats.files, value: formatNumber(inventory.totals.files) },
    { label: t.stats.folders, value: formatNumber(inventory.totals.folders) },
    { label: t.stats.size, value: formatBytes(inventory.totals.bytes) },
    { label: t.stats.tables, value: formatNumber(inventory.totals.tables) },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 rounded-card bg-surface-raised px-5 py-4 shadow-soft ring-1 ring-line">
            <dt className="text-xs font-medium text-ink-muted">{stat.label}</dt>
            <dd className="text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {(inventory.truncated || unreadable > 0 || tableIssues > 0) && (
        <div className="flex flex-col gap-2">
          {inventory.truncated && <Alert tone="warn">{t.issues.truncated}</Alert>}
          {unreadable > 0 && <Alert tone="warn">{t.issues.unreadable(unreadable)}</Alert>}
          {tableIssues > 0 && <Alert tone="warn">{t.issues.tables(tableIssues)}</Alert>}
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-2">
        <section aria-labelledby="inventory-boxes" className="flex min-h-0 flex-col gap-3">
          <header className="flex items-baseline justify-between gap-3">
            <h2 id="inventory-boxes" className="text-lg font-semibold">
              {t.boxesTitle}
            </h2>
            <p className="text-xs text-ink-muted">{t.boxesHint}</p>
          </header>
          <ul className="grid min-h-0 auto-rows-min gap-3 overflow-y-auto p-1 sm:grid-cols-2">
            {inventory.boxes.map((box, index) => (
              <li key={box.id}>
                <DataBox
                  code={String(index + 1).padStart(2, '0')}
                  name={es.box.kinds[CATEGORY_BOX_KIND[box.id]]}
                  kind={CATEGORY_BOX_KIND[box.id]}
                  status="open"
                  compact
                  risk={box.risk}
                  itemCount={box.fileCount}
                  sizeLabel={formatBytes(box.bytes)}
                  note={box.flaggedCount > 0 ? t.flagged(box.flaggedCount) : undefined}
                  selected={selected === box.id}
                  onSelect={() => setSelected(box.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        <InventoryDetail inventory={inventory} category={selected} />
      </div>

      <footer className="flex justify-end">
        <Button icon={ArrowRight} iconPosition="end" onClick={onNext}>
          {t.next}
        </Button>
      </footer>
    </div>
  );
}
