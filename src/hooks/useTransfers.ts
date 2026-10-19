import { useCallback, useEffect, useState } from 'react';
import { getBridge, type TransferDraft, type TransferSummary } from '@/bridge';

export type TransfersState =
  | { status: 'loading' }
  | { status: 'ready'; items: TransferSummary[] }
  | { status: 'browser-only' }
  | { status: 'error' };

/** List of saved transfer drafts, newest first. */
export function useTransfers() {
  const [state, setState] = useState<TransfersState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    const bridge = getBridge();
    if (!bridge) {
      setState({ status: 'browser-only' });
      return;
    }
    try {
      setState({ status: 'ready', items: await bridge.transfers.list() });
    } catch {
      setState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(async (): Promise<TransferDraft | null> => {
    const bridge = getBridge();
    if (!bridge) return null;
    return bridge.transfers.create();
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const bridge = getBridge();
      if (!bridge) return;
      await bridge.transfers.remove(id);
      await refresh();
    },
    [refresh],
  );

  return { state, refresh, create, remove };
}
