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
import { useState, type ComponentType } from 'react';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { IconButton } from '@/components/ui/IconButton';
import { useAppInfo } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';
import { AiSection } from './AiSection';
import { BoxesSection } from './BoxesSection';
import { ButtonsSection } from './ButtonsSection';
import { ColorsSection } from './ColorsSection';
import { DialogsSection } from './DialogsSection';
import { OverviewSection } from './OverviewSection';
import { RiskSection } from './RiskSection';
import { TypographySection } from './TypographySection';

const n = es.nav.items;

interface SectionEntry extends NavItem {
  component: ComponentType;
}

const SECTIONS: SectionEntry[] = [
  { id: 'overview', label: n.overview, icon: House, component: OverviewSection },
  { id: 'colors', label: n.colors, icon: Palette, component: ColorsSection },
  { id: 'typography', label: n.typography, icon: Type, component: TypographySection },
  { id: 'buttons', label: n.buttons, icon: MousePointerClick, component: ButtonsSection },
  { id: 'boxes', label: n.boxes, icon: Boxes, component: BoxesSection },
  { id: 'risk', label: n.risk, icon: TrafficCone, component: RiskSection },
  { id: 'ai', label: n.ai, icon: Sparkles, component: AiSection },
  { id: 'dialogs', label: n.dialogs, icon: SquareStack, component: DialogsSection },
];

export function DesignSystemScreen() {
  const appInfo = useAppInfo();
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];
  const ActiveSection = active.component;
  const labels = es.showcase.sections.buttons.iconLabels;

  const versionFooter =
    appInfo.status === 'connected' ? (
      <p className="px-2 font-mono text-xs text-ink-muted">
        v{appInfo.info.version} · IPC v{appInfo.info.contractVersion}
      </p>
    ) : null;

  return (
    <div className="flex h-full gap-4 p-4">
      <Sidebar items={SECTIONS} activeId={activeId} onSelect={setActiveId} footer={versionFooter} />

      <main className="glass flex min-w-0 flex-1 flex-col rounded-panel">
        <div className="flex items-center justify-end gap-3 px-10 pt-8">
          <ConnectionBadge state={appInfo} />
          <IconButton icon={Search} label={labels.search} variant="inverse" />
          <IconButton icon={Bell} label={labels.notifications} variant="inverse" />
        </div>

        {/* One section at a time; the key remounts it so its entrance animation replays. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div key={active.id} className="mx-auto h-full max-w-6xl px-10 pt-6 pb-10">
            <ActiveSection />
          </div>
        </div>
      </main>
    </div>
  );
}
