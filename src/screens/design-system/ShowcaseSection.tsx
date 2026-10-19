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
      className="enter-stagger flex flex-col gap-6"
    >
      <div id={`${id}-title`}>
        <CardHeader title={title} description={description} />
      </div>
      {children}
    </section>
  );
}
