import { useEffect, useState } from 'react';
import { getBridge, type AiStatus } from '@/bridge';

/** Whether the interview runs with the real AI or in demo mode. */
export function useAiStatus(): AiStatus | null {
  const [status, setStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    let active = true;
    getBridge()
      ?.ai.getStatus()
      .then((next) => active && setStatus(next))
      .catch(() => active && setStatus(null));
    return () => {
      active = false;
    };
  }, []);

  return status;
}
