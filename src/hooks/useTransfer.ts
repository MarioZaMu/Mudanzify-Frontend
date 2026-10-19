import { useCallback, useEffect, useRef, useState } from 'react';
import { getBridge, type ScanProgress, type SourceKind, type TransferDraft } from '@/bridge';

export type TransferTask = 'sources' | 'destination' | 'scan' | 'rename';

/**
 * One transfer draft and the actions on it. Every action goes through the
 * backend, which only reads the user's files at this stage.
 */
export function useTransfer(id: string) {
  const [draft, setDraft] = useState<TransferDraft | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [task, setTask] = useState<TransferTask | null>(null);
  const [error, setError] = useState<'generic' | 'scan' | null>(null);
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
    async (name: TransferTask, action: () => Promise<TransferDraft>, failure: 'generic' | 'scan' = 'generic') => {
      if (taskRef.current) return null;
      taskRef.current = name;
      setTask(name);
      setError(null);
      try {
        const next = await action();
        setDraft(next);
        return next;
      } catch {
        setError(failure);
        return null;
      } finally {
        taskRef.current = null;
        setTask(null);
      }
    },
    [],
  );

  const api = getBridge()?.transfers;

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

  return {
    draft,
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
