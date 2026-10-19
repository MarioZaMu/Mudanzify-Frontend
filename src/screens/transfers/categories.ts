import type { FileCategory } from '@/bridge';
import type { BoxKind } from '@/components/ui/DataBox';

/** How each inventory category is drawn as a box. */
export const CATEGORY_BOX_KIND: Record<FileCategory, BoxKind> = {
  documents: 'documents',
  spreadsheets: 'spreadsheet',
  images: 'images',
  media: 'media',
  archives: 'archives',
  code: 'code',
  other: 'other',
};
