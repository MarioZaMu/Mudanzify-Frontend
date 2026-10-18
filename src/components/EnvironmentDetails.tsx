import type { AppInfo } from '@/bridge';
import { es } from '@/i18n/es';

const t = es.setup.details;

export function EnvironmentDetails({ info }: { info: AppInfo }) {
  const rows = [
    [t.version, info.version],
    [t.electron, info.versions.electron],
    [t.chrome, info.versions.chrome],
    [t.node, info.versions.node],
    [t.platform, info.platform],
    [t.contract, `v${info.contractVersion}`],
  ] as const;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-sm font-semibold text-stone-500">{t.title}</h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-stone-500">{label}</dt>
            <dd className="font-medium tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
