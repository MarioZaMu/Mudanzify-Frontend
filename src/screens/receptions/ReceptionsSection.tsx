import { useState } from 'react';
import { ReceptionsView } from './ReceptionsView';
import { ReceptionWorkspace } from './ReceptionWorkspace';

/** Switches between the list of receptions and the review of one of them. */
export function ReceptionsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return openId ? (
    <ReceptionWorkspace key={openId} id={openId} onBack={() => setOpenId(null)} />
  ) : (
    <ReceptionsView onOpen={setOpenId} />
  );
}
