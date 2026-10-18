import {
  Bell,
  Boxes,
  House,
  MousePointerClick,
  Palette,
  Search,
  Sparkles,
  SquareStack,
  TrafficCone,
  Type,
} from 'lucide-react';
import { useRef } from 'react';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { LogoMark } from '@/components/brand/Logo';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useAppInfo } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';
import { AiSection } from './AiSection';
import { BoxesSection } from './BoxesSection';
import { ButtonsSection } from './ButtonsSection';
import { ColorsSection } from './ColorsSection';
import { DialogsSection } from './DialogsSection';
import { RiskSection } from './RiskSection';
import { TypographySection } from './TypographySection';

const n = es.nav.items;

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: n.overview, icon: House },
  { id: 'colors', label: n.colors, icon: Palette },
  { id: 'typography', label: n.typography, icon: Type },
  { id: 'buttons', label: n.buttons, icon: MousePointerClick },
  { id: 'boxes', label: n.boxes, icon: Boxes },
  { id: 'risk', label: n.risk, icon: TrafficCone },
  { id: 'ai', label: n.ai, icon: Sparkles },
  { id: 'dialogs', label: n.dialogs, icon: SquareStack },
];

const NAV_IDS = NAV_ITEMS.map((item) => item.id);

export function DesignSystemScreen() {
  const appInfo = useAppInfo();
  const scrollRef = useRef<HTMLElement>(null);
  const activeId = useActiveSection(NAV_IDS, scrollRef);
  const t = es.showcase;

  const versionFooter =
    appInfo.status === 'connected' ? (
      <p className="px-2 font-mono text-xs text-ink-muted">
        v{appInfo.info.version} · IPC v{appInfo.info.contractVersion}
      </p>
    ) : null;

  return (
    <div className="flex h-full gap-4 p-4">
      <Sidebar items={NAV_ITEMS} activeId={activeId} footer={versionFooter} />

      <main ref={scrollRef} className="glass flex-1 overflow-y-auto rounded-panel">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-10 pt-8 pb-24">
          <header id="overview" className="flex scroll-mt-8 flex-col gap-10">
            <div className="flex items-center justify-end gap-3">
              <ConnectionBadge state={appInfo} />
              <IconButton icon={Search} label={t.sections.buttons.iconLabels.search} variant="inverse" />
              <IconButton icon={Bell} label={t.sections.buttons.iconLabels.notifications} variant="inverse" />
            </div>

            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-5">
                <Badge tone="primary" className="w-fit">
                  {t.eyebrow}
                </Badge>
                <h1 className="text-display">{t.title}</h1>
                <p className="max-w-xl text-lg text-ink-muted">{t.intro}</p>
              </div>
              <div className="hidden rounded-panel bg-surface-inverse p-8 lg:block">
                <LogoMark className="size-28" />
              </div>
            </div>
          </header>

          <ColorsSection />
          <TypographySection />
          <ButtonsSection />
          <BoxesSection />
          <RiskSection />
          <AiSection />
          <DialogsSection />
        </div>
      </main>
    </div>
  );
}
