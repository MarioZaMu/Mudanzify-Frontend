import { ArrowUpRight, Bell, Ellipsis, FolderPlus, Plus, Search, Trash2, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { es } from '@/i18n/es';
import { ShowcaseSection } from './ShowcaseSection';

const t = es.showcase.sections.buttons;

export function ButtonsSection() {
  return (
    <ShowcaseSection id="buttons" title={t.title} description={t.description}>
      <Card className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button icon={Truck} size="lg">
            {t.primary}
          </Button>
          <Button variant="secondary" icon={ArrowUpRight} iconPosition="end">
            {t.secondary}
          </Button>
          <Button variant="outline" icon={FolderPlus}>
            {t.outline}
          </Button>
          <Button variant="ghost">{t.ghost}</Button>
          <Button variant="danger" icon={Trash2}>
            {t.danger}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button loading>{t.loading}</Button>
          <Button variant="outline" disabled>
            {t.disabled}
          </Button>
          <Button size="sm" variant="secondary">
            {t.secondary}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <IconButton icon={Search} label={t.iconLabels.search} variant="inverse" />
          <IconButton icon={Bell} label={t.iconLabels.notifications} variant="inverse" />
          <IconButton icon={Plus} label={t.iconLabels.add} variant="primary" />
          <IconButton icon={Ellipsis} label={t.iconLabels.more} />
          <IconButton icon={Ellipsis} label={t.iconLabels.more} variant="ghost" />
          <span className="mx-2 h-8 w-px bg-line" aria-hidden />
          <Badge>{es.box.status.open}</Badge>
          <Badge tone="primary">{es.ai.badge}</Badge>
          <Badge tone="accent">+18</Badge>
          <Badge tone="inverse">v2</Badge>
        </div>
      </Card>
    </ShowcaseSection>
  );
}
