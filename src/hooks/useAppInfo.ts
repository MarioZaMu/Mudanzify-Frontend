import { useEffect, useState } from 'react';
import { getBridge, type AppInfo } from '@/bridge';

export type AppInfoState =
  | { status: 'checking' }
  | { status: 'connected'; info: AppInfo }
  | { status: 'browser-only' }
  | { status: 'error' };

/** Asks the backend for its runtime information through the preload bridge. */
export function useAppInfo(): AppInfoState {
  const [state, setState] = useState<AppInfoState>({ status: 'checking' });

  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) {
      setState({ status: 'browser-only' });
      return;
    }

    let active = true;
    bridge.app
      .getInfo()
      .then((info) => active && setState({ status: 'connected', info }))
      .catch(() => active && setState({ status: 'error' }));

    return () => {
      active = false;
    };
  }, []);

  return state;
}
