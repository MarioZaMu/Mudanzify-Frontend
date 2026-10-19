import { PackageOpen } from 'lucide-react';
import type { FileCategory, Inventory, InventoryFile, SheetProfile } from '@/bridge';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { formatBytes, formatNumber } from '@/lib/format';
import { CATEGORY_BOX_KIND } from './categories';

const t = es.workspace.inventory;

/** Files rendered at once; the rest are summarized to keep the panel fast. */
const MAX_LISTED_FILES = 60;
const PREVIEW_ROWS = 4;
const PREVIEW_COLUMNS = 6;

/** Contents of the selected box: its tables (for spreadsheets) and its files. */
export function InventoryDetail({ inventory, category }: { inventory: Inventory; category: FileCategory | null }) {
  if (!category) {
    return (
      <Card variant="sunken" className="flex flex-col items-center justify-center gap-2 text-ink-muted">
        <PackageOpen aria-hidden size={28} />
        {t.detailEmpty}
      </Card>
    );
  }

  const files = inventory.files.filter((file) => file.category === category);
  const fileIds = new Set(files.map((file) => file.id));
  const tables = inventory.tables.filter((table) => fileIds.has(table.fileId));
  const hidden = files.length - MAX_LISTED_FILES;

  return (
    <Card
      key={category}
      as="section"
      aria-label={es.box.kinds[CATEGORY_BOX_KIND[category]]}
      className="flex min-h-0 flex-col gap-5 overflow-y-auto animate-[rise-in_300ms_var(--ease-out-soft)_both]"
    >
      {tables.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">{t.tablesTitle}</h3>
          {tables.map((table) =>
            table.sheets.map((sheet) => (
              <SheetPreview
                key={`${table.fileId}-${sheet.name}`}
                title={table.format === 'csv' ? table.fileName : `${table.fileName} · ${sheet.name}`}
                sheet={sheet}
              />
            )),
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">{t.filesTitle}</h3>
        <ul className="flex flex-col">
          {files.slice(0, MAX_LISTED_FILES).map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </ul>
        {hidden > 0 && <p className="text-sm text-ink-muted">{t.moreFiles(formatNumber(hidden))}</p>}
      </div>
    </Card>
  );
}

function FileRow({ file }: { file: InventoryFile }) {
  return (
    <li className="flex items-center gap-3 border-b border-line py-2 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{file.name}</span>
        <span className="truncate font-mono text-xs text-ink-muted" title={file.relativePath}>
          {file.relativePath}
        </span>
      </div>
      {file.flags.map((flag) => (
        <span key={flag} className="rounded-full bg-risk-warn-soft px-2 py-0.5 text-xs font-medium text-risk-warn-ink">
          {t.flags[flag]}
        </span>
      ))}
      <span className="w-20 shrink-0 text-right text-xs text-ink-muted tabular-nums">{formatBytes(file.size)}</span>
    </li>
  );
}

function SheetPreview({ title, sheet }: { title: string; sheet: SheetProfile }) {
  const columns = sheet.columns.slice(0, PREVIEW_COLUMNS);

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-surface-sunken p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="truncate text-sm font-semibold">{title}</h4>
        <p className="text-xs text-ink-muted">
          {t.rows(formatNumber(sheet.rowCount))} · {t.columns(sheet.columns.length)}
        </p>
      </header>

      <ul className="flex flex-wrap gap-1.5">
        {sheet.columns.map((column) => (
          <li
            key={column.name}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium',
              column.empty > 0 ? 'bg-risk-warn-soft text-risk-warn-ink' : 'bg-surface-raised text-ink',
            )}
          >
            {column.name}
            <span className="ml-1.5 opacity-80">· {column.empty > 0 ? t.emptyCells(column.empty) : t.complete}</span>
          </li>
        ))}
      </ul>

      {sheet.sampleRows.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-surface-raised ring-1 ring-line">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{t.previewTitle}</caption>
            <thead>
              <tr className="border-b border-line">
                {columns.map((column) => (
                  <th key={column.name} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.sampleRows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-line last:border-b-0">
                  {columns.map((column, columnIndex) => {
                    const value = row[columnIndex] ?? '';
                    return (
                      <td key={column.name} className="max-w-40 truncate px-3 py-2">
                        {value === '' ? <span className="text-risk-warn-ink">—</span> : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sheet.sampledRows < sheet.rowCount && (
        <p className="text-xs text-ink-muted">{t.sampledNote(formatNumber(sheet.sampledRows))}</p>
      )}
    </article>
  );
}
