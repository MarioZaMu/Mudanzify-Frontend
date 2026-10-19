import { LogoMark } from '@/components/brand/Logo';
import { Badge } from '@/components/ui/Badge';
import { es } from '@/i18n/es';

const t = es.showcase;

export function OverviewSection() {
  return (
    <section
      aria-labelledby="overview-title"
      className="enter-stagger grid h-full items-center gap-8 lg:grid-cols-[1fr_auto]"
    >
      <div className="flex flex-col gap-5">
        <Badge tone="primary" className="w-fit">
          {t.eyebrow}
        </Badge>
        <h1 id="overview-title" className="text-display">
          {t.title}
        </h1>
        <p className="max-w-xl text-lg text-ink-muted">{t.intro}</p>
      </div>
      <div className="hidden lg:block">
        <LogoMark className="size-64 drop-shadow-xl" />
      </div>
    </section>
  );
}
