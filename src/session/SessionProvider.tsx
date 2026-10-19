import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBridge, type OnboardingState, type UserRole } from '@/bridge';

/** Where the onboarding should open when it is shown again. */
export type OnboardingEntry = 'start' | 'role';

interface SessionContextValue {
  status: 'loading' | 'ready';
  onboarding: OnboardingState;
  onboardingEntry: OnboardingEntry;
  completeOnboarding(role: UserRole): Promise<void>;
  /** Re-opens the onboarding, either from the beginning or at role selection. */
  reopenOnboarding(entry: OnboardingEntry): Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = 'mudanzify:onboarding';
const EMPTY_STATE: OnboardingState = { completed: false, role: null };

/** Browser-only fallback when the UI runs outside Electron. */
const localStore = {
  read(): OnboardingState {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as OnboardingState | null;
      return parsed ?? EMPTY_STATE;
    } catch {
      return EMPTY_STATE;
    }
  },
  write(state: OnboardingState): OnboardingState {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  },
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const bridge = getBridge();
  const [status, setStatus] = useState<SessionContextValue['status']>('loading');
  const [onboarding, setOnboarding] = useState<OnboardingState>(EMPTY_STATE);
  const [onboardingEntry, setOnboardingEntry] = useState<OnboardingEntry>('start');

  useEffect(() => {
    const load = bridge ? bridge.onboarding.get() : Promise.resolve(localStore.read());
    void load
      .then(setOnboarding)
      .catch(() => setOnboarding(EMPTY_STATE))
      .finally(() => setStatus('ready'));
  }, [bridge]);

  const completeOnboarding = useCallback(
    async (role: UserRole) => {
      const next = bridge
        ? await bridge.onboarding.complete(role)
        : localStore.write({ completed: true, role });
      setOnboarding(next);
    },
    [bridge],
  );

  const reopenOnboarding = useCallback(
    async (entry: OnboardingEntry) => {
      setOnboardingEntry(entry);
      const next = bridge
        ? await bridge.onboarding.reset()
        : localStore.write({ ...localStore.read(), completed: false });
      setOnboarding(next);
    },
    [bridge],
  );

  const value = useMemo(
    () => ({ status, onboarding, onboardingEntry, completeOnboarding, reopenOnboarding }),
    [status, onboarding, onboardingEntry, completeOnboarding, reopenOnboarding],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside <SessionProvider>');
  return context;
}
