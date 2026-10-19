import { LogoMark } from '@/components/brand/Logo';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { AppShell } from '@/screens/shell/AppShell';
import { SessionProvider, useSession } from '@/session/SessionProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

function Root() {
  const { status, onboarding } = useSession();

  if (status === 'loading') {
    return (
      <div className="grid h-full place-items-center">
        <LogoMark className="size-20 animate-pulse" />
      </div>
    );
  }

  if (!onboarding.completed || !onboarding.role) return <OnboardingScreen />;
  return <AppShell role={onboarding.role} />;
}

export function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Root />
      </SessionProvider>
    </ThemeProvider>
  );
}
