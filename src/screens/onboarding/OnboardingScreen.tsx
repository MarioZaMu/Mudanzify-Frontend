import { ArrowLeft, ArrowRight, Inbox, Send } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import type { UserRole } from '@/bridge';
import { Logo } from '@/components/brand/Logo';
import { DeliverArt, PackArt, ReviewArt, WelcomeArt } from '@/components/onboarding/illustrations';
import { RoleCard } from '@/components/onboarding/RoleCard';
import { StepDots } from '@/components/onboarding/StepDots';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { es } from '@/i18n/es';
import { useSession } from '@/session/SessionProvider';

const t = es.onboarding;

interface IntroStep {
  id: 'welcome' | 'pack' | 'review' | 'deliver';
  eyebrow: string;
  title: string;
  body: string;
  art: ComponentType;
}

const INTRO_STEPS: IntroStep[] = [
  { id: 'welcome', ...t.welcome, art: WelcomeArt },
  { id: 'pack', ...t.pack, art: PackArt },
  { id: 'review', ...t.review, art: ReviewArt },
  { id: 'deliver', ...t.deliver, art: DeliverArt },
];

const ROLE_STEP = INTRO_STEPS.length;
const TOTAL_STEPS = INTRO_STEPS.length + 1;

/** True when a key event comes from a control that uses arrow keys itself. */
const isOwnArrowTarget = (target: EventTarget | null) =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

export function OnboardingScreen() {
  const { onboarding, onboardingEntry, completeOnboarding } = useSession();
  const [step, setStep] = useState(onboardingEntry === 'role' ? ROLE_STEP : 0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [role, setRole] = useState<UserRole | null>(onboarding.role);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const goTo = (target: number) => {
    const clamped = Math.min(TOTAL_STEPS - 1, Math.max(0, target));
    if (clamped === step) return;
    setDirection(clamped > step ? 'next' : 'prev');
    setStep(clamped);
  };

  // Move focus to the new heading so screen readers announce each step.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOwnArrowTarget(event.target)) return;
      if (event.key === 'ArrowRight') goTo(step + 1);
      if (event.key === 'ArrowLeft') goTo(step - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const finish = async () => {
    if (!role) return;
    setSubmitting(true);
    try {
      await completeOnboarding(role);
    } finally {
      setSubmitting(false);
    }
  };

  const isRoleStep = step === ROLE_STEP;
  const intro = INTRO_STEPS[step];
  const animation = direction === 'next' ? 'slide-in-next' : 'slide-in-prev';

  return (
    <div className="h-full p-4">
      <div className="glass flex h-full flex-col gap-6 rounded-panel p-8">
        <header className="flex items-center justify-between">
          <Logo />
          {!isRoleStep && (
            <Button variant="ghost" size="sm" onClick={() => goTo(ROLE_STEP)}>
              {t.skip}
            </Button>
          )}
        </header>

        <main
          key={step}
          className="min-h-0 flex-1"
          style={{ animation: `${animation} 450ms var(--ease-out-soft) both` }}
        >
          {isRoleStep ? (
            <section aria-labelledby="onboarding-title" className="mx-auto flex h-full max-w-4xl flex-col justify-center gap-8">
              <div className="flex flex-col items-center gap-3 text-center">
                <Badge tone="accent">{t.role.eyebrow}</Badge>
                <h1
                  id="onboarding-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-title outline-none md:text-5xl md:tracking-tight"
                >
                  {t.role.title}
                </h1>
                <p className="text-lg text-ink-muted">{t.role.body}</p>
              </div>

              <fieldset className="grid gap-5 md:grid-cols-2">
                <legend className="sr-only">{t.role.legend}</legend>
                <RoleCard
                  value="sender"
                  icon={Send}
                  roleName={es.roles.sender}
                  {...t.role.sender}
                  checked={role === 'sender'}
                  onChange={setRole}
                />
                <RoleCard
                  value="receiver"
                  icon={Inbox}
                  roleName={es.roles.receiver}
                  {...t.role.receiver}
                  checked={role === 'receiver'}
                  onChange={setRole}
                />
              </fieldset>
            </section>
          ) : (
            <section aria-labelledby="onboarding-title" className="grid h-full items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div className="flex max-w-xl flex-col gap-6">
                <Badge tone={intro.id === 'review' ? 'primary' : 'neutral'} className="w-fit">
                  {intro.eyebrow}
                </Badge>
                <h1
                  id="onboarding-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-5xl leading-[1.02] font-semibold tracking-tight text-balance outline-none xl:text-6xl"
                >
                  {intro.title}
                </h1>
                <p className="text-lg text-ink-muted">{intro.body}</p>
              </div>
              <div className="h-full max-h-[34rem] min-h-80">
                <intro.art />
              </div>
            </section>
          )}
        </main>

        <footer className="flex items-center justify-between">
          <StepDots total={TOTAL_STEPS} current={step} onSelect={goTo} />
          <span className="sr-only" aria-live="polite">
            {t.progress(step + 1, TOTAL_STEPS)}
          </span>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" icon={ArrowLeft} onClick={() => goTo(step - 1)}>
                {t.back}
              </Button>
            )}
            {isRoleStep ? (
              <Button
                size="lg"
                icon={ArrowRight}
                iconPosition="end"
                disabled={!role}
                loading={submitting}
                onClick={finish}
                title={role ? undefined : t.role.chooseFirst}
              >
                {role ? t.role.continueAs(es.roles[role]) : t.role.chooseFirst}
              </Button>
            ) : (
              <Button size="lg" icon={ArrowRight} iconPosition="end" onClick={() => goTo(step + 1)}>
                {step === 0 ? t.welcome.start : t.next}
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
