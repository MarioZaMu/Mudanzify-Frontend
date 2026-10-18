import type { ReactNode } from 'react';
import { CardHeader } from '@/components/ui/Card';

interface ShowcaseSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function ShowcaseSection({ id, title, description, children }: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-8 flex-col gap-6 animate-[rise-in_500ms_var(--ease-out-soft)_both]"
    >
      <div id={`${id}-title`}>
        <CardHeader title={title} description={description} />
      </div>
      {children}
    </section>
  );
}
