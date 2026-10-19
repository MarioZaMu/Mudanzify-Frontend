const numberFormat = new Intl.NumberFormat('es', { useGrouping: true });
const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' });
const relativeFormat = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

/** 1536 -> "1,5 KB" (Spanish decimal comma). */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  const value = bytes / 1024 ** exponent;
  const digits = value >= 100 ? 0 : 1;
  return `${value.toLocaleString('es', { maximumFractionDigits: digits })} ${UNITS[exponent]}`;
}

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** "hace 5 minutos", "ayer"… */
export function formatRelative(iso: string): string {
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
