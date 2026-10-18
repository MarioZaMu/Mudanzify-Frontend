import { useState } from 'react';
import { DataBox, type DataBoxProps } from '@/components/ui/DataBox';
import { es } from '@/i18n/es';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.boxes;

const SAMPLE_BOXES: Array<Omit<DataBoxProps, 'selected' | 'onSelect'>> = [
  { code: '01', name: t.samples.photos, kind: 'folder', status: 'open', risk: 'safe', itemCount: 1284, sizeLabel: '6,4 GB', progress: 20 },
  { code: '02', name: t.samples.clients, kind: 'spreadsheet', status: 'labeled', risk: 'warn', itemCount: 312, sizeLabel: '1,1 MB', progress: 55 },
  { code: '03', name: t.samples.contacts, kind: 'contacts', status: 'packed', risk: 'danger', itemCount: 48, sizeLabel: '96 KB', progress: 90 },
  { code: '04', name: t.samples.contracts, kind: 'documents', status: 'delivered', risk: 'safe', itemCount: 86, sizeLabel: '240 MB', progress: 100 },
];

export function BoxesSection() {
  const [selected, setSelected] = useState<string>('02');

  return (
    <ShowcaseSection id="boxes" title={t.title} description={t.description}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SAMPLE_BOXES.map((box) => (
          <DataBox
            key={box.code}
            {...box}
            selected={selected === box.code}
            onSelect={() => setSelected(box.code)}
          />
        ))}
      </div>
    </ShowcaseSection>
  );
}
