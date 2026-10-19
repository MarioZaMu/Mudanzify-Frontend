import {
  Check,
  CircleDashed,
  Contact,
  Copy,
  FileText,
  Folder,
  Image,
  Inbox,
  Package,
  ShieldAlert,
  Sheet,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { LogoMark } from '@/components/brand/Logo';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { MiniBox } from './MiniBox';

const t = es.onboarding;

/** Shared stage for every illustration. Purely decorative for screen readers. */
function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('relative h-full w-full overflow-hidden rounded-panel bg-surface-sunken', className)}
    >
      {children}
    </div>
  );
}

export function WelcomeArt() {
  return (
    <Stage className="grid place-items-center">
      <span className="absolute -top-16 -right-10 size-72 rounded-full bg-primary-soft blur-3xl" />
      <span className="absolute -bottom-20 -left-10 size-80 rounded-full bg-kraft-200/60 blur-3xl dark:bg-kraft-900/60" />
      {/* Soft 3D-like props, echoing the reference shots */}
      <span className="absolute bottom-[12%] left-[10%] h-20 w-28 rounded-[2rem] bg-surface-raised shadow-lifted animate-[float_6s_ease-in-out_infinite]" />
      <span className="absolute top-[14%] right-[12%] size-24 rounded-full border-[14px] border-surface-raised shadow-lifted animate-[float_7s_ease-in-out_1s_infinite]" />
      <LogoMark className="relative size-64 drop-shadow-2xl animate-[float_5s_ease-in-out_infinite]" />
    </Stage>
  );
}

export function PackArt() {
  return (
    <Stage className="grid place-items-center">
      <div className="relative h-80 w-96">
        <MiniBox
          icon={Image}
          label={t.pack.boxes.photos}
          className="absolute bottom-0 left-0 h-36 w-44 animate-[drop-in_600ms_var(--ease-out-soft)_both]"
        />
        <MiniBox
          icon={Sheet}
          label={t.pack.boxes.clients}
          className="absolute right-0 bottom-0 h-36 w-44 animate-[drop-in_600ms_var(--ease-out-soft)_150ms_both]"
        />
        <MiniBox
          icon={Contact}
          label={t.pack.boxes.contacts}
          className="absolute top-0 left-1/2 h-36 w-44 -translate-x-1/2 animate-[drop-in_600ms_var(--ease-out-soft)_300ms_both]"
        />
      </div>
    </Stage>
  );
}

const FINDINGS = [
  { icon: Copy, label: t.review.findings.duplicates, tone: 'bg-risk-warn-soft text-risk-warn-ink', delay: '500ms' },
  { icon: CircleDashed, label: t.review.findings.gaps, tone: 'bg-risk-warn-soft text-risk-warn-ink', delay: '900ms' },
  { icon: ShieldAlert, label: t.review.findings.sensitive, tone: 'bg-risk-danger-soft text-risk-danger-ink', delay: '1300ms' },
];

export function ReviewArt() {
  return (
    <Stage className="grid place-items-center">
      <div className="flex w-96 flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-soft-ink">
          <Sparkles size={14} />
          {t.review.scanning}
        </span>

        <div className="relative overflow-hidden rounded-3xl bg-surface-raised p-5 shadow-lifted ring-1 ring-line">
          <div className="flex flex-col gap-3">
            {[100, 82, 92, 70, 88].map((width, index) => (
              <div key={index} className="flex gap-3">
                <span className="h-3 w-16 rounded-full bg-surface-sunken" />
                <span className="h-3 rounded-full bg-surface-sunken" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
          <span className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_16px_4px] shadow-primary/40 animate-[scan_2.4s_ease-in-out_infinite_alternate]" />
        </div>

        <div className="flex flex-wrap gap-2">
          {FINDINGS.map(({ icon: Icon, label, tone, delay }) => (
            <span
              key={label}
              className={cn('inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold', tone)}
              style={{ animation: `pop-in 400ms var(--ease-out-soft) ${delay} both` }}
            >
              <Icon size={14} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function Endpoint({ icon: Icon, label }: { icon: typeof Folder; label: string }) {
  return (
    <div className="flex w-28 flex-col items-center gap-2 rounded-3xl bg-surface-raised p-4 shadow-soft ring-1 ring-line">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface-sunken">
        <Icon size={22} />
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

export function DeliverArt() {
  return (
    <Stage className="grid place-items-center">
      <div className="flex w-[26rem] flex-col items-center gap-8">
        <div className="flex w-full items-center gap-3">
          <Endpoint icon={Folder} label={t.deliver.origin} />
          <div className="relative h-12 flex-1">
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                className="stroke-line-strong animate-[dash-flow_800ms_linear_infinite]"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
            <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 animate-[travel_3s_var(--ease-out-soft)_infinite]">
              <span className="grid size-10 place-items-center rounded-xl bg-box text-box-ink shadow-soft ring-1 ring-box-line">
                <Package size={18} />
              </span>
            </span>
          </div>
          <Endpoint icon={Inbox} label={t.deliver.destination} />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-inverse px-4 text-sm font-medium text-ink-inverse shadow-soft animate-[pop-in_400ms_var(--ease-out-soft)_400ms_both]">
            <Check size={16} />
            {t.deliver.confirmed}
          </span>
          <span className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-raised px-4 text-sm font-medium shadow-soft ring-1 ring-line animate-[pop-in_400ms_var(--ease-out-soft)_700ms_both]">
            <FileText size={16} />
            {t.deliver.report}
          </span>
        </div>
      </div>
    </Stage>
  );
}
