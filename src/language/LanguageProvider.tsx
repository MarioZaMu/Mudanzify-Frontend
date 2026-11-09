import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBridge, type Language } from '@/bridge';
import { setLanguage as applyLanguage } from '@/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage(language: Language): void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'mudanzify:language';

/** Synchronous first guess (before the backend answers) so the first paint is in the right language. */
function readLocalLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'es' || stored === 'en') return stored;
  } catch {
    // Storage can be blocked; fall through to the browser language.
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function rememberLocally(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Not critical: the backend keeps the real preference.
  }
}

/**
 * Owns the interface language. The backend settings are the source of truth
 * because the main process also writes reports and receipts in this language.
 * Consumers must call `useLanguage()` so they re-render when it changes.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = readLocalLanguage();
    applyLanguage(initial);
    return initial;
  });

  useEffect(() => {
    let active = true;
    getBridge()
      ?.language.get()
      .then((stored) => {
        if (!active) return;
        applyLanguage(stored);
        rememberLocally(stored);
        setLanguageState(stored);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((next: Language) => {
    applyLanguage(next);
    rememberLocally(next);
    setLanguageState(next);
    getBridge()?.language.set(next).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return context;
}
