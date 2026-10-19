import { useState, type ComponentType } from 'react';
import { Tabs } from '@/components/ui/Tabs';
import { es } from '@/i18n/es';
import { AiSection } from './AiSection';
import { BoxesSection } from './BoxesSection';
import { ButtonsSection } from './ButtonsSection';
import { ColorsSection } from './ColorsSection';
import { DialogsSection } from './DialogsSection';
import { RiskSection } from './RiskSection';
import { TypographySection } from './TypographySection';

const tabs = es.showcase.tabs;

const SECTIONS: Array<{ id: string; label: string; component: ComponentType }> = [
  { id: 'colors', label: tabs.colors, component: ColorsSection },
  { id: 'typography', label: tabs.typography, component: TypographySection },
  { id: 'buttons', label: tabs.buttons, component: ButtonsSection },
  { id: 'boxes', label: tabs.boxes, component: BoxesSection },
  { id: 'risk', label: tabs.risk, component: RiskSection },
  { id: 'ai', label: tabs.ai, component: AiSection },
  { id: 'dialogs', label: tabs.dialogs, component: DialogsSection },
];

/** Design system reference, one section per tab (no long scroll). */
export function DesignSystemView() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];
  const ActiveSection = active.component;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-title">{es.showcase.title}</h1>
        <Tabs
          items={SECTIONS}
          activeId={activeId}
          onChange={setActiveId}
          label={es.showcase.tabsLabel}
          idPrefix="design-system"
        />
      </div>
      <div
        key={active.id}
        id="design-system-panel"
        role="tabpanel"
        aria-labelledby={`design-system-tab-${active.id}`}
        className="min-h-0 flex-1"
      >
        <ActiveSection />
      </div>
    </div>
  );
}
