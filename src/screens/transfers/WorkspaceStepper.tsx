import { PillStepper } from '@/components/ui/PillStepper';
import { strings } from '@/i18n';

export const WORKSPACE_STEPS = ['origin', 'inventory', 'destination', 'interview', 'analysis', 'execution'] as const;
export type WorkspaceStep = (typeof WORKSPACE_STEPS)[number];

interface WorkspaceStepperProps {
  active: WorkspaceStep;
  completed: Record<WorkspaceStep, boolean>;
  available: Record<WorkspaceStep, boolean>;
  onSelect: (step: WorkspaceStep) => void;
}

/** Origen → Inventario → Destino → Entrevista IA → Revisión IA → Traspaso. */
export function WorkspaceStepper(props: WorkspaceStepperProps) {
  return <PillStepper steps={WORKSPACE_STEPS} labels={strings.workspace.steps} label={strings.workspace.steps.label} {...props} />;
}
