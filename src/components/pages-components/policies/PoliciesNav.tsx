'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/components/ui/utils';

const HEADER_OFFSET = 112;

type PolicyNavItem = {
  slug: string;
  title: string;
};

function hashSlug() {
  return decodeURIComponent(window.location.hash.replace(/^#/, ''));
}

export function PoliciesNav({ items }: { items: PolicyNavItem[] }) {
  const slugsKey = items.map((item) => item.slug).join('|');
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug ?? '');
  const spyReadyRef = useRef(false);

  useEffect(() => {
    const slugs = slugsKey ? slugsKey.split('|') : [];
    if (slugs.length === 0) return;

    const applyHash = () => {
      const slug = hashSlug();
      if (slug && slugs.includes(slug)) {
        setActiveSlug(slug);
        return slug;
      }
      return '';
    };

    const syncFromScroll = () => {
      let current = slugs[0] ?? '';
      for (const slug of slugs) {
        const el = document.getElementById(slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top - HEADER_OFFSET <= 8) {
          current = slug;
        }
      }
      setActiveSlug(current);
      if (current && hashSlug() !== current) {
        history.replaceState(null, '', `#${current}`);
      }
    };

    const initialHash = applyHash();
    spyReadyRef.current = !initialHash;

    let timeout: number | undefined;
    if (initialHash) {
      const scrollToHash = () => {
        document.getElementById(initialHash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      requestAnimationFrame(scrollToHash);
      timeout = window.setTimeout(() => {
        scrollToHash();
        spyReadyRef.current = true;
        syncFromScroll();
      }, 200);
    } else {
      syncFromScroll();
    }

    const onScroll = () => {
      if (!spyReadyRef.current) return;
      syncFromScroll();
    };
    const onHashChange = () => {
      const slug = applyHash();
      if (slug) {
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHashChange);
    return () => {
      if (timeout) window.clearTimeout(timeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [slugsKey]);

  return (
    <nav aria-label="Policy sections" className="mb-10 md:sticky md:top-28 md:mb-0 md:self-start">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
      <ul className="mt-3 space-y-1">
        {items.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <li key={item.slug}>
              <a
                href={`#${item.slug}`}
                data-policy-nav={item.slug}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => {
                  spyReadyRef.current = true;
                  setActiveSlug(item.slug);
                }}
                className={cn(
                  'block rounded-md px-3 py-1.5 text-sm leading-5 transition-colors',
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
