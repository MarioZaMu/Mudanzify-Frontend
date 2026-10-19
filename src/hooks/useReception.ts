import { useCallback, useEffect, useRef, useState } from 'react';
import { getBridge, type BoxReview, type FileCategory, type Reception, type VerifyProgress } from '@/bridge';

export type ReceptionTask = 'verify' | 'review' | 'confirm';

/** One reception and its actions; the received files are only read. */
export function useReception(id: string) {
  const [reception, setReception] = useState<Reception | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [task, setTask] = useState<ReceptionTask | null>(null);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState<VerifyProgress | null>(null);
  const taskRef = useRef<ReceptionTask | null>(null);

  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) {
      setLoadFailed(true);
      return;
    }
    let active = true;
    bridge.receptions
      .get(id)
      .then((loaded) => active && setReception(loaded))
      .catch(() => active && setLoadFailed(true));
    const unsubscribe = bridge.receptions.onVerifyProgress((update) => {
      if (update.receptionId === id) setProgress(update);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [id]);

  const run = useCallback(async (name: ReceptionTask, action: () => Promise<Reception>) => {
    if (taskRef.current) return null;
    taskRef.current = name;
    setTask(name);
    setFailed(false);
    try {
      const next = await action();
      setReception(next);
      return next;
    } catch {
      setFailed(true);
      return null;
    } finally {
      taskRef.current = null;
      setTask(null);
    }
  }, []);

  const api = getBridge()?.receptions;

  return {
    reception,
    loadFailed,
    task,
    failed,
    progress,
    clearError: () => setFailed(false),
    verify: async () => {
      if (!api) return null;
      setProgress(null);
      const next = await run('verify', () => api.verify(id));
      setProgress(null);
      return next;
    },
    reviewBox: (category: FileCategory, review: BoxReview) => api && run('review', () => api.reviewBox(id, category, review)),
    confirm: () => api && run('confirm', () => api.confirm(id)),
    reopen: () => api && run('review', () => api.reopen(id)),
    openFolder: () => api?.openFolder(id).catch(() => setFailed(true)),
    openReport: () => api?.openReport(id).catch(() => setFailed(true)),
    openReceipt: () => api?.openReceipt(id).catch(() => setFailed(true)),
  };
}
