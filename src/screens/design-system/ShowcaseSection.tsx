import type { ReactNode } from 'react';

interface ShowcaseSectionProps {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

/** Tab panel content. The visible title is the active tab, so the heading is for screen readers only. */
export function ShowcaseSection({ id, title, description, children }: ShowcaseSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="enter-stagger flex flex-col gap-5">
      <header>
        <h2 id={`${id}-title`} className="sr-only">
          {title}
        </h2>
        <p className="max-w-prose text-ink-muted">{description}</p>
      </header>
      {children}
    </section>
  );
}
