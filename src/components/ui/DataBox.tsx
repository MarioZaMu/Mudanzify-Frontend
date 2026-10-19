import {
  Archive,
  Code,
  Contact,
  File,
  FileText,
  Film,
  Folder,
  Image,
  Package,
  PackageCheck,
  PackageOpen,
  Sheet,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { ProgressBar } from './ProgressBar';
import { RiskBadge, RiskLight, type RiskLevel } from './RiskBadge';

export type BoxKind =
  | 'folder'
  | 'spreadsheet'
  | 'contacts'
  | 'documents'
  | 'images'
  | 'media'
  | 'archives'
  | 'code'
  | 'other';
export type BoxStatus = 'open' | 'labeled' | 'packed' | 'delivered';

export interface DataBoxProps {
  /** Short code printed on the box label, e.g. "01". */
  code: string;
  name: string;
  kind: BoxKind;
  status: BoxStatus;
  risk: RiskLevel;
  itemCount: number;
  sizeLabel: string;
  /** Packing progress from 0 to 100. */
  progress?: number;
  /** Extra line under the counts, e.g. how many files need a review. */
  note?: string;
  selected?: boolean;
  onSelect?: () => void;
}

const KIND_ICONS: Record<BoxKind, LucideIcon> = {
  folder: Folder,
  spreadsheet: Sheet,
  contacts: Contact,
  documents: FileText,
  images: Image,
  media: Film,
  archives: Archive,
  code: Code,
  other: File,
};

const STATUS_ICONS: Record<BoxStatus, LucideIcon> = {
  open: PackageOpen,
  labeled: Tag,
  packed: Package,
  delivered: PackageCheck,
};

/**
 * A group of data represented as a cardboard moving box:
 * it gets labeled, packed and delivered.
 */
export function DataBox({
  code,
  name,
  kind,
  status,
  risk,
  itemCount,
  sizeLabel,
  progress,
  note,
  selected = false,
  onSelect,
}: DataBoxProps) {
  const KindIcon = KIND_ICONS[kind];
  const StatusIcon = STATUS_ICONS[status];
  const interactive = Boolean(onSelect);

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-5 overflow-hidden rounded-card bg-box p-5 pt-7 text-box-ink ring-1 ring-box-line',
        'transition-[transform,box-shadow] duration-200 ease-out-soft',
        interactive && 'hover:-translate-y-0.5 hover:shadow-lifted',
        selected && 'ring-2 ring-ink',
      )}
    >
      {/* Packing tape across the top flap */}
      <span aria-hidden className="absolute inset-x-0 top-0 mx-auto h-4 w-20 rounded-b-md bg-box-tape/70" />

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-surface-raised/80 text-box-ink">
            <KindIcon aria-hidden size={20} />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[0.7rem] font-medium tracking-wider text-box-ink-muted uppercase">
              {es.box.kinds[kind]} · {code}
            </span>
            <h3 className="leading-tight font-semibold">
              {interactive ? (
                <button
                  type="button"
                  onClick={onSelect}
                  aria-pressed={selected}
                  className="cursor-pointer text-left after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ink"
                >
                  {name}
                </button>
              ) : (
                name
              )}
            </h3>
          </div>
        </div>
        <RiskLight level={risk} />
      </header>

      <p className="flex gap-4 text-sm">
        <span className="font-medium">{es.box.items(itemCount)}</span>
        <span className="text-box-ink-muted tabular-nums">{sizeLabel}</span>
      </p>

      {note && <p className="-mt-3 text-xs font-medium text-box-ink-muted">{note}</p>}

      {progress !== undefined && (
        <ProgressBar value={progress} label={es.showcase.sections.boxes.progress} tone="box" />
      )}

      <footer className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface-raised/80 px-3 text-xs font-medium">
          <StatusIcon aria-hidden size={14} />
          {es.box.status[status]}
        </span>
        <RiskBadge level={risk} />
        {selected && <span className="sr-only">{es.box.selected}</span>}
      </footer>
    </article>
  );
}
