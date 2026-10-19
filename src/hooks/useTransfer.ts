import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getBridge,
  type AnalysisProgress,
  type ExecutionPlan,
  type ExecutionProgress,
  type FindingDecision,
  type InterviewAnswerInput,
  type MappingDecision,
  type PriorityDecision,
  type ReviewDecision,
  type ScanProgress,
  type SourceKind,
  type TransferDraft,
} from '@/bridge';

export type TransferTask = 'sources' | 'destination' | 'scan' | 'rename' | 'interview' | 'review' | 'analysis' | 'decide' | 'execute';
export type TransferError = 'generic' | 'scan' | 'ai' | 'ai-limit' | 'ai-auth' | 'execute' | 'destination';

/** The backend tags the two AI errors the user can fix (see ai/geminiClient.ts). */
function classify(error: unknown, failure: TransferError): TransferError {
  const message = error instanceof Error ? error.message : '';
  if (failure === 'execute') return message.includes('DESTINATION_UNAVAILABLE') ? 'destination' : 'execute';
  if (failure !== 'ai') return failure;
  if (message.includes('AI_RATE_LIMIT')) return 'ai-limit';
  if (message.includes('AI_AUTH')) return 'ai-auth';
  return 'ai';
}

/**
 * One transfer draft and the actions on it. Every action goes through the
 * backend, which only reads the user's files at this stage.
 */
export function useTransfer(id: string) {
  const [draft, setDraft] = useState<TransferDraft | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [task, setTask] = useState<TransferTask | null>(null);
  const [error, setError] = useState<TransferError | null>(null);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress | null>(null);
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);
  const [planFailed, setPlanFailed] = useState(false);
  const taskRef = useRef<TransferTask | null>(null);

  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) {
      setLoadFailed(true);
      return;
    }
    let active = true;
    bridge.transfers
      .get(id)
      .then((loaded) => active && setDraft(loaded))
      .catch(() => active && setLoadFailed(true));

    const unsubscribeScan = bridge.transfers.onScanProgress((update) => {
      if (update.transferId === id) setProgress(update);
    });
    const unsubscribeAnalysis = bridge.analysis.onProgress((update) => {
      if (update.transferId === id) setAnalysisProgress(update);
    });
    const unsubscribeExecution = bridge.execution.onProgress((update) => {
      if (update.transferId === id) setExecutionProgress(update);
    });
    return () => {
      active = false;
      unsubscribeScan();
      unsubscribeAnalysis();
      unsubscribeExecution();
    };
  }, [id]);

  /** Runs one backend action at a time and keeps the latest draft. */
  const run = useCallback(
    async (name: TransferTask, action: () => Promise<TransferDraft>, failure: TransferError = 'generic') => {
      if (taskRef.current) return null;
      taskRef.current = name;
      setTask(name);
      setError(null);
      try {
        const next = await action();
        setDraft(next);
        return next;
      } catch (caught) {
        setError(classify(caught, failure));
        return null;
      } finally {
        taskRef.current = null;
        setTask(null);
      }
    },
    [],
  );

  const api = getBridge()?.transfers;
  const interviewApi = getBridge()?.interview;
  const analysisApi = getBridge()?.analysis;
  const executionApi = getBridge()?.execution;

  const addSources = (kind: SourceKind) => api && run('sources', () => api.addSources(id, kind));
  const removeSource = (sourceId: string) => api && run('sources', () => api.removeSource(id, sourceId));
  const pickDestination = () => api && run('destination', () => api.pickDestination(id));
  const rename = (name: string) => api && run('rename', () => api.rename(id, name));
  const scan = async () => {
    if (!api) return null;
    setProgress(null);
    const next = await run('scan', () => api.scan(id), 'scan');
    setProgress(null);
    return next;
  };

  const interview = {
    start: () => interviewApi && run('interview', () => interviewApi.start(id), 'ai'),
    answer: (answer: InterviewAnswerInput | null) =>
      interviewApi && run('interview', () => interviewApi.answer(id, answer), 'ai'),
    review: (suggestionId: string, decision: ReviewDecision) =>
      interviewApi && run('review', () => interviewApi.review(id, suggestionId, decision)),
    finish: () => interviewApi && run('review', () => interviewApi.finish(id)),
    reset: () => interviewApi && run('review', () => interviewApi.reset(id)),
  };

  const analysis = {
    run: async () => {
      if (!analysisApi) return null;
      setAnalysisProgress(null);
      const next = await run('analysis', () => analysisApi.run(id), 'ai');
      setAnalysisProgress(null);
      return next;
    },
    decideFinding: (findingId: string, decision: FindingDecision) =>
      analysisApi && run('decide', () => analysisApi.decideFinding(id, findingId, decision)),
    reviewMapping: (mappingId: string, decision: MappingDecision) =>
      analysisApi && run('decide', () => analysisApi.reviewMapping(id, mappingId, decision)),
    setPriority: (decision: PriorityDecision) => analysisApi && run('decide', () => analysisApi.setPriority(id, decision)),
    confirm: () => analysisApi && run('decide', () => analysisApi.confirm(id)),
    reset: () => analysisApi && run('decide', () => analysisApi.reset(id)),
  };

  const execution = {
    /** Loads what will be copied; it writes nothing. */
    preview: async () => {
      if (!executionApi) return;
      setPlanFailed(false);
      try {
        setPlan(await executionApi.preview(id));
      } catch {
        setPlan(null);
        setPlanFailed(true);
      }
    },
    start: async () => {
      if (!executionApi) return null;
      setExecutionProgress(null);
      const next = await run('execute', () => executionApi.start(id), 'execute');
      setExecutionProgress(null);
      return next;
    },
    // Cancel goes around `run`: it must work while the copy is the running task.
    cancel: () => executionApi?.cancel(id),
    openOutput: () => executionApi?.openOutput(id).catch(() => setError('generic')),
    openReport: () => executionApi?.openReport(id).catch(() => setError('generic')),
    reset: () => executionApi && run('decide', () => executionApi.reset(id)),
  };

  return {
    draft,
    interview,
    analysis,
    analysisProgress,
    execution,
    executionProgress,
    plan,
    planFailed,
    loadFailed,
    task,
    error,
    progress,
    clearError: () => setError(null),
    addSources,
    removeSource,
    pickDestination,
    rename,
    scan,
  };
}
