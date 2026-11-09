import { getLanguage } from '@/i18n';

const NUMBER_FORMATS = new Map<string, Intl.NumberFormat>();

/** Intl objects are costly to build, so they are cached per language. */
function numberFormat(): Intl.NumberFormat {
  const language = getLanguage();
  let format = NUMBER_FORMATS.get(language);
  if (!format) {
    format = new Intl.NumberFormat(language, { useGrouping: 'always' });
    NUMBER_FORMATS.set(language, format);
  }
  return format;
}

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

/** 1536 -> "1,5 KB" in Spanish, "1.5 KB" in English. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const digits = value >= 100 ? 0 : 1;
  return `${value.toLocaleString(getLanguage(), { maximumFractionDigits: digits })} ${UNITS[exponent]}`;
}

export function formatNumber(value: number): string {
  return numberFormat().format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(getLanguage(), { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** "hace 5 minutos" / "5 minutes ago", "ayer" / "yesterday"… */
export function formatRelative(iso: string): string {
  const relativeFormat = new Intl.RelativeTimeFormat(getLanguage(), { numeric: 'auto' });
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const steps: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relativeFormat.format(Math.round(seconds / size), unit);
  }
  return relativeFormat.format(0, 'minute');
}
