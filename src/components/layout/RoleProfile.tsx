import { Inbox, Repeat2, Send } from 'lucide-react';
import type { UserRole } from '@/bridge';
import { IconButton } from '@/components/ui/IconButton';
import { es } from '@/i18n/es';

const ROLE_ICONS = { sender: Send, receiver: Inbox } as const;

interface RoleProfileProps {
  role: UserRole;
  onChangeRole: () => void;
}

/** Sidebar card with the current role, like the profile card in the references. */
export function RoleProfile({ role, onChangeRole }: RoleProfileProps) {
  const Icon = ROLE_ICONS[role];

  return (
    <div className="flex items-center gap-2.5 rounded-card bg-surface-sunken p-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-inverse text-ink-inverse">
        <Icon aria-hidden size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-ink-muted">{es.roles.label}</span>
        <span className="truncate font-semibold">{es.roles[role]}</span>
      </div>
      <IconButton icon={Repeat2} label={es.roles.change} variant="ghost" size="sm" onClick={onChangeRole} />
    </div>
  );
}
