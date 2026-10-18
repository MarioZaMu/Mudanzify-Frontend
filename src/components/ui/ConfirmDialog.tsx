import { ShieldAlert, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { es } from '@/i18n/es';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { IconButton } from './IconButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  /**
   * `danger` is for destructive or irreversible actions: it asks for an
   * explicit, separate acknowledgement before the confirm button unlocks.
   */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal built on the native <dialog>: focus trap, Esc to close and inert background. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = es.common.confirm,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const isDanger = tone === 'danger';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setAcknowledged(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) cancels.
        if (event.target === event.currentTarget) onCancel();
      }}
      className={cn(
        'm-auto w-[min(28rem,calc(100vw-2rem))] rounded-panel bg-surface-raised p-0 text-ink shadow-lifted ring-1 ring-line',
        'backdrop:bg-graphite/40 backdrop:backdrop-blur-sm',
        'open:animate-[dialog-in_220ms_var(--ease-out-soft)]',
      )}
    >
      <div className="flex flex-col gap-6 p-7">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            {isDanger && (
              <span className="grid size-11 place-items-center rounded-2xl bg-risk-danger-soft text-risk-danger-ink">
                <ShieldAlert aria-hidden size={22} />
              </span>
            )}
            <h2 id={titleId} className="text-xl font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <IconButton icon={X} label={es.common.close} variant="ghost" size="sm" onClick={onCancel} />
        </header>

        <p id={descriptionId} className="text-ink-muted">
          {description}
        </p>

        {isDanger && (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-risk-danger-soft p-4 text-sm font-medium text-risk-danger-ink">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              className="mt-0.5 size-4 accent-current"
            />
            {es.dialog.irreversibleAck}
          </label>
        )}

        <footer className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} autoFocus={isDanger}>
            {es.common.cancel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            disabled={isDanger && !acknowledged}
            onClick={onConfirm}
            autoFocus={!isDanger}
          >
            {confirmLabel}
          </Button>
        </footer>
      </div>
    </dialog>
  );
}
