import { Save, X } from 'lucide-react';
import { useId, useState } from 'react';
import type { ColumnMapping, Inventory, MappingDecision } from '@/bridge';
import { AiSuggestion } from '@/components/ui/AiSuggestion';
import { Button } from '@/components/ui/Button';
import { es } from '@/i18n/es';
import { tableName } from './describe';

const t = es.workspace.analysis.mappings;

interface MappingCardProps {
  mapping: ColumnMapping;
  inventory: Inventory;
  disabled: boolean;
  onReview: (decision: MappingDecision) => void;
}

/** A proposal to unify several columns under one name; accepted, edited or rejected on its own. */
export function MappingCard({ mapping, inventory, disabled, onReview }: MappingCardProps) {
  const [editing, setEditing] = useState(false);
  const sources = mapping.sources.map((source) => `«${source.column}» en ${tableName(inventory, source)}`).join(' · ');

  if (editing) {
    return (
      <EditMapping
        mapping={mapping}
        disabled={disabled}
        onCancel={() => setEditing(false)}
        onSave={(standardName) => {
          onReview({ action: 'edit', standardName });
          setEditing(false);
        }}
      />
    );
  }

  return (
    <AiSuggestion
      title={t.title(mapping.standardName)}
      body={`${mapping.reason} ${t.columns}: ${sources}.`}
      decision={mapping.status}
      disabled={disabled}
      onAccept={() => onReview({ action: 'accept' })}
      onEdit={() => setEditing(true)}
      onReject={() => onReview({ action: 'reject' })}
      onUndo={() => onReview({ action: 'undo' })}
    />
  );
}

function EditMapping({
  mapping,
  disabled,
  onSave,
  onCancel,
}: {
  mapping: ColumnMapping;
  disabled: boolean;
  onSave: (standardName: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(mapping.standardName);
  const inputId = useId();

  return (
    <form
      className="flex flex-col gap-4 rounded-card bg-surface-raised p-5 shadow-soft ring-2 ring-primary animate-[rise-in_250ms_var(--ease-out-soft)_both]"
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim()) onSave(name.trim());
      }}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium">
          {t.nameLabel}
        </label>
        <input
          id={inputId}
          value={name}
          maxLength={60}
          required
          autoFocus
          onChange={(event) => setName(event.target.value)}
          className="h-11 rounded-xl bg-surface-sunken px-3 text-sm ring-1 ring-line ring-inset"
        />
      </div>
      <p className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary-soft-ink">
        <span className="font-semibold">{t.original}:</span> {mapping.original ?? mapping.standardName}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" icon={X} onClick={onCancel}>
          {es.common.cancel}
        </Button>
        <Button type="submit" icon={Save} disabled={disabled || name.trim() === ''}>
          {t.save}
        </Button>
      </div>
    </form>
  );
}
