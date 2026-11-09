import { Boxes, House, Inbox, Palette } from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/bridge';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { RoleProfile } from '@/components/layout/RoleProfile';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { useAppInfo } from '@/hooks/useAppInfo';
import { strings } from '@/i18n';
import { DesignSystemView } from '@/screens/design-system/DesignSystemView';
import { HomeView } from '@/screens/home/HomeView';
import { ReceptionsSection } from '@/screens/receptions/ReceptionsSection';
import { TransfersSection } from '@/screens/transfers/TransfersSection';
import { useSession } from '@/session/SessionProvider';

type ViewId = 'home' | 'transfers' | 'receptions' | 'design-system';

/** The sender packs transfers; the receiver reviews what arrived. Built per render for the active language. */
function navItems(role: UserRole): NavItem[] {
  const home: NavItem = { id: 'home', label: strings.nav.home, icon: House };
  const design: NavItem = { id: 'design-system', label: strings.nav.designSystem, icon: Palette };
  const work: NavItem =
    role === 'sender'
      ? { id: 'transfers', label: strings.nav.transfers, icon: Boxes }
      : { id: 'receptions', label: strings.nav.receptions, icon: Inbox };
  return [home, work, design];
}

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
      <Sidebar items={navItems(role)} activeId={view} onSelect={(id) => setView(id as ViewId)} footer={footer} />

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
