import { useState } from 'react';
import { TransferWorkspace } from './TransferWorkspace';
import { TransfersView } from './TransfersView';

/** Switches between the list of drafts and the workspace of one draft. */
export function TransfersSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return openId ? (
    <TransferWorkspace key={openId} id={openId} onBack={() => setOpenId(null)} />
  ) : (
    <TransfersView onOpen={setOpenId} />
  );
}
