import type { FileCategory, Finding, Inventory, TableRef } from '@/bridge';
import { es } from '@/i18n/es';
import { CATEGORY_BOX_KIND } from '../categories';

const t = es.workspace.analysis.findings;

export const categoryName = (category: FileCategory) => es.box.kinds[CATEGORY_BOX_KIND[category]];

export const fileName = (inventory: Inventory, fileId: string) =>
  inventory.files.find((file) => file.id === fileId)?.relativePath ?? fileId;

/** "clientes.csv" for a CSV, "contactos.xlsx · Equipo" for a sheet of a workbook. */
export function tableName(inventory: Inventory, table: TableRef): string {
  const file = inventory.files.find((candidate) => candidate.id === table.fileId);
  if (!file) return table.sheet;
  return file.name === table.sheet ? file.relativePath : `${file.relativePath} · ${table.sheet}`;
}

export interface FindingText {
  title: string;
  /** Where it was found (a table) or a count line. */
  subtitle: string | null;
  /** Files involved, for duplicate and junk findings. */
  files: string[];
  note: string | null;
}

export function describeFinding(finding: Finding, inventory: Inventory): FindingText {
  switch (finding.kind) {
    case 'duplicate-files':
      return {
        title: t.duplicateFiles(finding.fileIds.length),
        subtitle: null,
        files: finding.fileIds.map((id) => fileName(inventory, id)),
        note: t.keep(fileName(inventory, finding.keepFileId)),
      };
    case 'duplicate-rows':
      return {
        title: t.duplicateRows(finding.duplicateRows, finding.totalRows),
        subtitle: tableName(inventory, finding.table),
        files: [],
        note: null,
      };
    case 'empty-cells':
      return {
        title: t.emptyCells(finding.column),
        subtitle: tableName(inventory, finding.table),
        files: [],
        note: t.emptyCount(finding.empty, finding.total),
      };
    case 'sensitive-column':
      return {
        title: t.sensitiveColumn(finding.column),
        subtitle: tableName(inventory, finding.table),
        files: [],
        note: `${t.sensitiveTypes[finding.sensitiveType]} · ${t.sensitiveCount(finding.matches, finding.total)} · ${t.example(finding.example)}`,
      };
    case 'junk-files':
      return {
        title: t.junk[finding.flag],
        subtitle: t.files(finding.fileIds.length),
        files: finding.fileIds.map((id) => fileName(inventory, id)),
        note: null,
      };
  }
}
