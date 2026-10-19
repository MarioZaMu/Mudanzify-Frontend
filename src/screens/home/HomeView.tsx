import { ArrowRight, CircleCheck, Lock, RotateCcw } from 'lucide-react';
import type { UserRole } from '@/bridge';
import { LogoMark } from '@/components/brand/Logo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { es } from '@/i18n/es';

const t = es.home;

interface HomeViewProps {
  role: UserRole;
  onReplayOnboarding: () => void;
  /** Opens the first available step (the transfers module for the sender). */
  onStart: () => void;
}

/** Role landing page. The step cards unlock as the next phases are built. */
export function HomeView({ role, onReplayOnboarding, onStart }: HomeViewProps) {
  return (
    <div className="enter-stagger flex h-full flex-col justify-center gap-10">
      <section className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-5">
          <Badge tone="inverse" className="w-fit">
            {es.roles[role]}
          </Badge>
          <h1 className="text-display">{t.title[role]}</h1>
          <p className="max-w-xl text-lg text-ink-muted">{t.intro[role]}</p>
        </div>
        <LogoMark className="hidden size-52 drop-shadow-xl lg:block" />
      </section>

      <ol className="grid gap-4 md:grid-cols-3">
        {t.steps[role].map((step, index) => {
          const available = role === 'sender' && index === 0;
          return (
            <li key={step.title}>
              <Card className="flex h-full flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-ink-muted">0{index + 1}</span>
                  {available ? (
                    <Badge tone="primary" icon={CircleCheck}>
                      {t.available}
                    </Badge>
                  ) : (
                    <Badge icon={Lock}>{t.soon}</Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                  <p className="text-sm text-ink-muted">{step.body}</p>
                </div>
                {available && (
                  <Button size="sm" icon={ArrowRight} iconPosition="end" className="mt-auto self-start" onClick={onStart}>
                    {t.go}
                  </Button>
                )}
              </Card>
            </li>
          );
        })}
      </ol>

      <div>
        <Button variant="ghost" icon={RotateCcw} onClick={onReplayOnboarding}>
          {t.replay}
        </Button>
      </div>
    </div>
  );
}
