import { useEffect, useState, type RefObject } from 'react';

/** Tracks which section is currently visible inside a scroll container. */
export function useActiveSection(ids: string[], rootRef: RefObject<HTMLElement | null>): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      // A section counts as active while it crosses the upper part of the view.
      { root, rootMargin: '-10% 0px -70% 0px' },
    );

    for (const id of ids) {
      const element = root.querySelector(`#${id}`);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids, rootRef]);

  return activeId;
}
