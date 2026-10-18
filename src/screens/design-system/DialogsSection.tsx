import { Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { es } from '@/i18n/es';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.dialogs;

type OpenDialog = 'default' | 'danger' | null;
type Result = 'confirmed' | 'cancelled' | null;

export function DialogsSection() {
  const [open, setOpen] = useState<OpenDialog>(null);
  const [result, setResult] = useState<Result>(null);

  const close = (next: Result) => {
    setOpen(null);
    setResult(next);
  };

  return (
    <ShowcaseSection id="dialogs" title={t.title} description={t.description}>
      <Card className="flex flex-wrap items-center gap-3">
        <Button icon={Truck} onClick={() => setOpen('default')}>
          {t.openDefault}
        </Button>
        <Button variant="danger" icon={Trash2} onClick={() => setOpen('danger')}>
          {t.openDanger}
        </Button>
        {result && (
          <span role="status">
            <Badge tone={result === 'confirmed' ? 'inverse' : 'neutral'}>{t.result[result]}</Badge>
          </span>
        )}
      </Card>

      <ConfirmDialog
        open={open === 'default'}
        title={t.defaultDialog.title}
        description={t.defaultDialog.description}
        confirmLabel={t.defaultDialog.confirm}
        onConfirm={() => close('confirmed')}
        onCancel={() => close('cancelled')}
      />
      <ConfirmDialog
        open={open === 'danger'}
        tone="danger"
        title={t.dangerDialog.title}
        description={t.dangerDialog.description}
        confirmLabel={t.dangerDialog.confirm}
        onConfirm={() => close('confirmed')}
        onCancel={() => close('cancelled')}
      />
    </ShowcaseSection>
  );
}
