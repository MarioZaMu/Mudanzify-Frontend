import { LogoMark } from '@/components/brand/Logo';
import { OnboardingScreen } from '@/screens/onboarding/OnboardingScreen';
import { AppShell } from '@/screens/shell/AppShell';
import { SessionProvider, useSession } from '@/session/SessionProvider';
import { LanguageProvider, useLanguage } from '@/language/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

function Root() {
  const { status, onboarding } = useSession();
  // Subscribing here re-renders the whole tree when the language changes.
  useLanguage();

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
      <LanguageProvider>
        <SessionProvider>
          <Root />
        </SessionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
