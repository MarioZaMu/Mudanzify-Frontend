import { useCallback, useEffect, useState } from 'react';
import { getBridge, type Reception, type ReceptionSummary } from '@/bridge';

export type ReceptionsState =
  | { status: 'loading' }
  | { status: 'ready'; items: ReceptionSummary[] }
  | { status: 'browser-only' }
  | { status: 'error' };

/** Received folders opened in this app, newest first. */
export function useReceptions() {
  const [state, setState] = useState<ReceptionsState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    const bridge = getBridge();
    if (!bridge) {
      setState({ status: 'browser-only' });
      return;
    }
    try {
      setState({ status: 'ready', items: await bridge.receptions.list() });
    } catch {
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Opens the native folder dialog; null when cancelled. */
  const open = useCallback(async (): Promise<Reception | null> => {
    const bridge = getBridge();
    return bridge ? bridge.receptions.open() : null;
  }, []);

  const remove = useCallback(
    async (id: string) => {
      await getBridge()?.receptions.remove(id);
      await refresh();
    },
    [refresh],
  );

  return { state, open, remove };
}
