import logoUrl from '@/assets/logo.svg';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';

/** Mudanzify mark: a moving box sealed with circuit tape (data + AI). */
export function LogoMark({ className }: { className?: string }) {
  return <img src={logoUrl} alt="" aria-hidden draggable={false} className={cn('size-8 select-none', className)} />;
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-9 drop-shadow-sm" />
      <span className="text-lg font-semibold tracking-tight">{es.app.name}</span>
    </span>
  );
}
