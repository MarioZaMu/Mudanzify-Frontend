import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getBridge,
  type InterviewAnswerInput,
  type ReviewDecision,
  type ScanProgress,
  type SourceKind,
  type TransferDraft,
} from '@/bridge';

export type TransferTask = 'sources' | 'destination' | 'scan' | 'rename' | 'interview' | 'review';
export type TransferError = 'generic' | 'scan' | 'ai' | 'ai-limit' | 'ai-auth';

/** The backend tags the two AI errors the user can fix (see ai/gemini.ts). */
function classify(error: unknown, failure: TransferError): TransferError {
  if (failure !== 'ai') return failure;
  const message = error instanceof Error ? error.message : '';
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

    const unsubscribe = bridge.transfers.onScanProgress((update) => {
      if (update.transferId === id) setProgress(update);
    });
    return () => {
      active = false;
      unsubscribe();
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

  return {
    draft,
    interview,
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
