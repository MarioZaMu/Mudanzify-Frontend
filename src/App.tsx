import { ConnectionBadge } from '@/components/ConnectionBadge';
import { EnvironmentDetails } from '@/components/EnvironmentDetails';
import { useAppInfo } from '@/hooks/useAppInfo';
import { es } from '@/i18n/es';

export function App() {
  const appInfo = useAppInfo();
  const t = es.setup;

  return (
    <main className="flex min-h-full items-center justify-center p-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col justify-between gap-10 rounded-[2rem] bg-white/70 p-10 shadow-sm ring-1 ring-stone-200 backdrop-blur">
          <div className="flex flex-col gap-6">
            <span className="text-sm font-medium text-stone-500">{t.phaseLabel}</span>
            <h1 className="text-6xl leading-none font-semibold tracking-tight text-balance">
              {es.app.name}
            </h1>
            <p className="max-w-md text-lg text-stone-600">{es.app.tagline}</p>
          </div>
          <div className="flex flex-col gap-4">
            <ConnectionBadge state={appInfo} />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{t.title}</h2>
              <p className="mt-2 max-w-md text-stone-600">{t.description}</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {appInfo.status === 'connected' && <EnvironmentDetails info={appInfo.info} />}
          <section className="rounded-3xl bg-stone-900 p-6 text-stone-50">
            <h2 className="text-sm font-semibold text-stone-400">{t.checklist.title}</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {t.checklist.items.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-stone-50 text-xs text-stone-900">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
