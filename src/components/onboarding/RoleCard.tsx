import { Check, CircleCheck, type LucideIcon } from 'lucide-react';
import type { UserRole } from '@/bridge';
import { cn } from '@/lib/cn';

interface RoleCardProps {
  value: UserRole;
  icon: LucideIcon;
  roleName: string;
  title: string;
  description: string;
  points: readonly string[];
  checked: boolean;
  onChange: (role: UserRole) => void;
}

/** Large selectable card backed by a native radio, so arrow keys and screen readers work. */
export function RoleCard({ value, icon: Icon, roleName, title, description, points, checked, onChange }: RoleCardProps) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer flex-col gap-6 rounded-panel bg-surface-raised p-7 shadow-soft ring-1 ring-line',
        'transition-[transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-1 hover:shadow-lifted',
        'has-checked:ring-2 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink',
      )}
    >
      <input
        type="radio"
        name="role"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid size-14 place-items-center rounded-2xl transition-colors duration-200',
            checked ? 'bg-surface-inverse text-ink-inverse' : 'bg-surface-sunken text-ink',
          )}
        >
          <Icon aria-hidden size={26} strokeWidth={1.75} />
        </span>
        <CircleCheck
          aria-hidden
          size={26}
          className={cn(
            'transition-[opacity,transform] duration-200 ease-out-soft',
            checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-medium tracking-wider text-ink-muted uppercase">{roleName}</span>
        <span className="text-2xl font-semibold tracking-tight">{title}</span>
        <span className="text-ink-muted">{description}</span>
      </div>

      <ul className="flex flex-col gap-2.5 text-sm">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2.5">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-sunken">
              <Check aria-hidden size={12} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </label>
  );
}
