import { BRIDGE_KEY, type MudanzifyBridge } from './contract';

declare global {
  interface Window {
    [BRIDGE_KEY]?: MudanzifyBridge;
  }
}

/**
 * Returns the API exposed by the backend preload script, or `null` when the UI
 * runs in a regular browser (e.g. opening the Vite URL outside Electron).
 */
export function getBridge(): MudanzifyBridge | null {
  return window[BRIDGE_KEY] ?? null;
}

export type {
  AnalysisProgress,
  ExecutionPlan,
  ExecutionProgress,
  ExecutionStatus,
  ItemResult,
  ItemStatus,
  PlanAction,
  PlanItem,
  SkipReason,
  TableChange,
  TransferExecution,
  ColumnMapping,
  ColumnSource,
  Finding,
  FindingChoice,
  FindingDecision,
  FindingKind,
  FindingStatus,
  MappingDecision,
  PriorityDecision,
  PriorityPlan,
  SensitiveType,
  TableRef,
  TransferAnalysis,
  AppInfo,
  ColumnProfile,
  AiMode,
  AiStatus,
  CriterionSuggestion,
  CriterionTopic,
  InterviewAnswerInput,
  InterviewQuestion,
  InterviewTurn,
  ReviewDecision,
  TransferInterview,
  MudanzifyBridge,
  OnboardingState,
  ThemePreference,
  ThemeState,
  UserRole,
  DestinationConflict,
  FileCategory,
  FileFlag,
  Inventory,
  InventoryBox,
  InventoryFile,
  InventoryIssue,
  RiskLevel,
  ScanProgress,
  SheetProfile,
  SourceKind,
  TableProfile,
  TransferDestination,
  TransferDraft,
  TransferSource,
  TransferSummary,
} from './contract';
export { FINDING_CHOICES, INTERVIEW_LIMITS } from './contract';
