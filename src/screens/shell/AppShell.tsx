import { Bell, House, Palette, Search } from 'lucide-react';
import { useState } from 'react';
import type { UserRole } from '@/bridge';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { RoleProfile } from '@/components/layout/RoleProfile';
import { Sidebar, type NavItem } from '@/components/layout/Sidebar';
import { IconButton } from '@/components/ui/IconButton';
import { useAppInfo } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';
import { DesignSystemView } from '@/screens/design-system/DesignSystemView';
import { HomeView } from '@/screens/home/HomeView';
import { useSession } from '@/session/SessionProvider';

type ViewId = 'home' | 'design-system';

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: es.nav.home, icon: House },
  { id: 'design-system', label: es.nav.designSystem, icon: Palette },
];

/** Main layout after onboarding: persistent sidebar, one view at a time. */
export function AppShell({ role }: { role: UserRole }) {
  const appInfo = useAppInfo();
  const { reopenOnboarding } = useSession();
  const [view, setView] = useState<ViewId>('home');
  const labels = es.showcase.sections.buttons.iconLabels;

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
      <Sidebar items={NAV_ITEMS} activeId={view} onSelect={(id) => setView(id as ViewId)} footer={footer} />

      <main className="glass flex min-w-0 flex-1 flex-col rounded-panel">
        <div className="flex items-center justify-end gap-3 px-10 pt-8">
          <ConnectionBadge state={appInfo} />
          <IconButton icon={Search} label={labels.search} variant="inverse" />
          <IconButton icon={Bell} label={labels.notifications} variant="inverse" />
        </div>

        {/* The key remounts the view so its entrance animation replays. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div key={view} className="mx-auto h-full max-w-6xl px-10 pt-4 pb-10">
            {view === 'home' ? (
              <HomeView role={role} onReplayOnboarding={() => void reopenOnboarding('start')} />
            ) : (
              <DesignSystemView />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
