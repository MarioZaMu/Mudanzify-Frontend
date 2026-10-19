import { Boxes, House, Inbox, Palette } from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/bridge';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { RoleProfile } from '@/components/layout/RoleProfile';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { useAppInfo } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';
import { DesignSystemView } from '@/screens/design-system/DesignSystemView';
import { HomeView } from '@/screens/home/HomeView';
import { ReceptionsSection } from '@/screens/receptions/ReceptionsSection';
import { TransfersSection } from '@/screens/transfers/TransfersSection';
import { useSession } from '@/session/SessionProvider';

type ViewId = 'home' | 'transfers' | 'receptions' | 'design-system';

const HOME_ITEM: NavItem = { id: 'home', label: es.nav.home, icon: House };
const TRANSFERS_ITEM: NavItem = { id: 'transfers', label: es.nav.transfers, icon: Boxes };
const RECEPTIONS_ITEM: NavItem = { id: 'receptions', label: es.nav.receptions, icon: Inbox };
const DESIGN_ITEM: NavItem = { id: 'design-system', label: es.nav.designSystem, icon: Palette };

/** The sender packs transfers; the receiver reviews what arrived. */
const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  sender: [HOME_ITEM, TRANSFERS_ITEM, DESIGN_ITEM],
  receiver: [HOME_ITEM, RECEPTIONS_ITEM, DESIGN_ITEM],
};

/** Main layout after onboarding: persistent sidebar, one view at a time. */
export function AppShell({ role }: { role: UserRole }) {
  const appInfo = useAppInfo();
  const { reopenOnboarding } = useSession();
  const [view, setView] = useState<ViewId>('home');

  const footer = (
    <>
      <RoleProfile role={role} onChangeRole={() => void reopenOnboarding('role')} />
      {appInfo.status === 'connected' && (
        <p className="px-2 font-mono text-xs text-ink-muted">
          v{appInfo.info.version} · IPC v{appInfo.info.contractVersion}
        </p>
      )}
    </>
  );

  return (
    <div className="flex h-full gap-4 p-4">
      <Sidebar items={NAV_ITEMS[role]} activeId={view} onSelect={(id) => setView(id as ViewId)} footer={footer} />

      <main className="glass flex min-w-0 flex-1 flex-col rounded-panel">
        <div className="flex items-center justify-end gap-3 px-10 pt-8">
          <ConnectionBadge state={appInfo} />
        </div>

        {/* The key remounts the view so its entrance animation replays. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div key={view} className="@container mx-auto h-full max-w-6xl px-10 pt-4 pb-10">
            {view === 'home' && (
              <HomeView
                role={role}
                onReplayOnboarding={() => void reopenOnboarding('start')}
                onStart={() => setView(role === 'sender' ? 'transfers' : 'receptions')}
              />
            )}
            {view === 'transfers' && <TransfersSection />}
            {view === 'receptions' && <ReceptionsSection />}
            {view === 'design-system' && <DesignSystemView />}
          </div>
        </div>
      </main>
    </div>
  );
}
