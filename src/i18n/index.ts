import type { Language } from '@/bridge';
import { en } from './en';
import { es } from './es';
import type { Widen } from './types';

export type Dictionary = Widen<typeof es>;

const DICTIONARIES: Record<Language, Dictionary> = { es, en };

type Plain = Record<string, unknown>;
const isPlain = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Copies nested objects but keeps strings, functions and arrays as they are. */
function clone<T>(value: T): T {
  if (!isPlain(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) as T;
}

/** Overwrites leaves in place so nested objects held by components stay valid. */
function assign(target: Plain, source: Plain): void {
  for (const [key, value] of Object.entries(source)) {
    const current = target[key];
    if (isPlain(value) && isPlain(current)) assign(current, value);
    else target[key] = value;
  }
}

let current: Language = 'es';

/**
 * Live strings of the active language. Components read `strings.x.y` while
 * rendering; switching language rewrites the leaves of this one object, so
 * module-level `const t = strings.x` references keep pointing at fresh text.
 * Never copy a leaf string into a module-level constant.
 */
export const strings: Dictionary = clone(es);

export function setLanguage(language: Language): void {
  if (language === current) return;
  current = language;
  assign(strings as unknown as Plain, DICTIONARIES[language] as unknown as Plain);
  document.documentElement.lang = language;
}

export const getLanguage = (): Language => current;
