'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPanel } from '@/components/admin/layout/AdminContent';
import { getCreateChapterRoutePath, getMentorBooksRoutePath, getMentorDashboardRoutePath } from '@/routes/routes';

const START_EVENT = 'mentor-content-tour:start';
export const MENTOR_SERIES_MODAL_EVENT = 'mentor-content-tour:series-modal';

export type MentorGuideStart = 'dashboard' | 'series' | 'books';

type GuideStep = {
  id: string;
  title: string;
  description: string;
  path: string;
  target: string;
  /** Open or close the create-series dialog before highlighting this step. */
  seriesModal?: 'open' | 'close';
};

const SERIES_PATH = getMentorBooksRoutePath();
const BOOK_FORM_PATH = getCreateChapterRoutePath(true);

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'intro',
    title: 'Create the series first',
    description:
      'A book can be saved only after its series exists, so the series comes first. This guide opens that form, walks through the required fields, then opens the book form. If you do not have separate series copy, reuse the book title, description, and cover.',
    path: getMentorDashboardRoutePath(),
    target: 'add-content-guide',
  },
  {
    id: 'open-series',
    title: 'Open the series form',
    description:
      'Create series is the start. Next opens the form. Title, description, and a cover image are required. Price is required only when the pricing model is series. For a single book, enter that book’s title, description, and cover here.',
    path: SERIES_PATH,
    target: 'series-create',
    seriesModal: 'close',
  },
  {
    id: 'series-copy',
    title: 'Title and description',
    description:
      'Both are required. Use the book name and summary when you do not have different series text. Readers see this on the series. You can edit it later if you add more books.',
    path: SERIES_PATH,
    target: 'series-copy',
    seriesModal: 'open',
  },
  {
    id: 'series-cover',
    title: 'Cover image',
    description:
      'A cover image is required. The same image you will use on the book is fine. Tags under the description are optional.',
    path: SERIES_PATH,
    target: 'series-cover',
    seriesModal: 'open',
  },
  {
    id: 'series-pricing',
    title: 'Status and pricing',
    description:
      'Status is required and starts as Draft, so the series stays unpublished until you change it. Choose book when each book has its own price. Choose series when readers buy the whole series at one price — Price (KSH) is then required.',
    path: SERIES_PATH,
    target: 'series-pricing',
    seriesModal: 'open',
  },
  {
    id: 'series-save',
    title: 'Save the series',
    description:
      'Create Series saves it. The book form can list this series only after that save. Fill the required fields and save before you add a book. Next opens the book form.',
    path: SERIES_PATH,
    target: 'series-save',
    seriesModal: 'open',
  },
  {
    id: 'book-series',
    title: 'Choose the series',
    description:
      'Series is required. Select the series you saved. If the list says no series is available, go Back and save the series first. A book cannot be created without one.',
    path: BOOK_FORM_PATH,
    target: 'book-series',
    seriesModal: 'close',
  },
  {
    id: 'book-copy',
    title: 'Book title and description',
    description:
      'Title and description are required. The slug fills in from the title. For a single book, use the same title and description you put on the series. The description is visible before someone buys the book.',
    path: BOOK_FORM_PATH,
    target: 'book-copy',
    seriesModal: 'close',
  },
  {
    id: 'book-content',
    title: 'Book content',
    description:
      'Content type is required. PDF asks you to upload the file. Book Content asks you to write the book in the editor. Readers see this only after they purchase.',
    path: BOOK_FORM_PATH,
    target: 'book-content',
    seriesModal: 'close',
  },
  {
    id: 'book-finish',
    title: 'Price, cover, and save',
    description:
      'If the series prices each book separately, set a price in KSH or mark the book free. If the series has one price, this book does not get its own price. A featured image is required, and the same cover as the series is fine. Accept the agreements, then Create Book.',
    path: BOOK_FORM_PATH,
    target: 'book-finish',
    seriesModal: 'close',
  },
];

const START_STEP: Record<MentorGuideStart, string> = {
  dashboard: 'intro',
  series: 'open-series',
  books: 'book-series',
};

type Rect = { top: number; left: number; width: number; height: number };

function findVisibleTarget(id: string): HTMLElement | null {
  const nodes = document.querySelectorAll<HTMLElement>(`[data-mentor-tour="${id}"]`);
  for (const node of nodes) {
    if (node.closest('[data-state="closed"]')) continue;
    const style = window.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    const box = node.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    return node;
  }
  return null;
}

function waitForTarget(id: string, timeoutMs: number, isCancelled: () => boolean) {
  return new Promise<HTMLElement | null>((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (isCancelled()) {
        resolve(null);
        return;
      }
      const element = findVisibleTarget(id);
      if (element) {
        resolve(element);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }
      window.setTimeout(tick, 80);
    };
    tick();
  });
}

function highlightRect(element: HTMLElement): Rect | null {
  const box = element.getBoundingClientRect();
  if (box.width < 2 || box.height < 2) return null;
  const pad = 6;
  return {
    top: box.top - pad,
    left: box.left - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function overlaps(point: { top: number; left: number }, rect: Rect, cardWidth: number, cardHeight: number) {
  const gap = 10;
  return (
    point.left < rect.left + rect.width + gap &&
    point.left + cardWidth > rect.left - gap &&
    point.top < rect.top + rect.height + gap &&
    point.top + cardHeight > rect.top - gap
  );
}

function placeCard(rect: Rect, cardWidth: number, cardHeight: number) {
  const margin = 16;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const gap = 14;
  const candidates = [
    { top: rect.top + rect.height + gap, left: rect.left },
    { top: rect.top + rect.height + gap, left: rect.left + rect.width - cardWidth },
    { top: rect.top - cardHeight - gap, left: rect.left },
    { top: rect.top - cardHeight - gap, left: rect.left + rect.width - cardWidth },
    { top: rect.top, left: rect.left + rect.width + gap },
    { top: rect.top + rect.height - cardHeight, left: rect.left + rect.width + gap },
    { top: rect.top, left: rect.left - cardWidth - gap },
    { top: margin + 80, left: viewportWidth - cardWidth - margin },
    { top: viewportHeight - cardHeight - margin, left: viewportWidth - cardWidth - margin },
  ];
  const fits = (point: { top: number; left: number }) =>
    point.top >= margin &&
    point.left >= margin &&
    point.top + cardHeight <= viewportHeight - margin &&
    point.left + cardWidth <= viewportWidth - margin &&
    !overlaps(point, rect, cardWidth, cardHeight);

  return (
    candidates.find(fits) ?? {
      top: margin + 80,
      left: Math.max(margin, viewportWidth - cardWidth - margin),
    }
  );
}

let seriesModalRequest: boolean | null = null;

export function getMentorSeriesModalRequest() {
  return seriesModalRequest;
}

function setSeriesModal(open: boolean) {
  seriesModalRequest = open;
  window.dispatchEvent(new CustomEvent(MENTOR_SERIES_MODAL_EVENT, { detail: { open } }));
}

function clearSeriesModalRequest() {
  seriesModalRequest = null;
}

function freezePageScroll() {
  const root = document.documentElement;
  if (root.dataset.guideScroll === '1') return;
  root.dataset.guideScroll = '1';
  root.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function releasePageScroll() {
  const root = document.documentElement;
  if (root.dataset.guideScroll !== '1') return;
  delete root.dataset.guideScroll;
  root.style.overflow = '';
  document.body.style.overflow = '';
}

function inertOutsideGuide() {
  document.querySelectorAll('body > *').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.hasAttribute('data-guide-root') || node.hasAttribute('data-guide-inert')) return;
    node.setAttribute('data-guide-inert', '');
    node.inert = true;
  });
}

function clearGuideInert() {
  document.querySelectorAll<HTMLElement>('[data-guide-inert]').forEach((node) => {
    node.inert = false;
    node.removeAttribute('data-guide-inert');
  });
}

export function startMentorContentTour(from: MentorGuideStart = 'dashboard') {
  window.dispatchEvent(new CustomEvent(START_EVENT, { detail: { from } }));
}

export function MentorContentTourButton({ from }: { from: MentorGuideStart }) {
  return (
    <Button
      type="button"
      className="global_btn rounded_full outline_primary"
      onPress={() => startMentorContentTour(from)}
      startContent={<Compass className="h-4 w-4" />}
    >
      {from === 'dashboard' ? 'Start guide' : 'How to add'}
    </Button>
  );
}

export function MentorAddContentGuide() {
  return (
    <AdminPanel tourId="add-content-guide" className="relative overflow-hidden">
      <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />
      <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">Create a Series, Then Add a Book</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            A book can be created only after its series exists. This guide opens the series form and its required fields, then the book form. If you do not have different text for the series, use the book title, description, and cover there too.
          </p>
        </div>
        <MentorContentTourButton from="dashboard" />
      </div>
    </AdminPanel>
  );
}

export function MentorContentTour() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [cardStyle, setCardStyle] = useState({ top: 24, left: 24 });
  const cardRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const pathnameRef = useRef(pathname);
  const positioningRef = useRef(false);
  const measureIdRef = useRef(0);

  indexRef.current = index;
  pathnameRef.current = pathname;
  const step = GUIDE_STEPS[index];
  const isLast = index >= GUIDE_STEPS.length - 1;

  const finish = () => {
    setSeriesModal(false);
    clearSeriesModalRequest();
    setOpen(false);
    setRect(null);
  };

  const go = (direction: 1 | -1) => {
    const next = indexRef.current + direction;
    if (next >= GUIDE_STEPS.length) {
      finish();
      return;
    }
    if (next < 0) return;
    setRect(null);
    setIndex(next);
  };

  useEffect(() => {
    const onStart = (event: Event) => {
      const from = (event as CustomEvent<{ from?: MentorGuideStart }>).detail?.from ?? 'dashboard';
      const startId = START_STEP[from] ?? START_STEP.dashboard;
      const startIndex = GUIDE_STEPS.findIndex((item) => item.id === startId);
      setRect(null);
      setIndex(startIndex >= 0 ? startIndex : 0);
      setRun((value) => value + 1);
      setOpen(true);
    };
    window.addEventListener(START_EVENT, onStart);
    return () => window.removeEventListener(START_EVENT, onStart);
  }, []);

  useEffect(() => {
    if (!open || !step) return;
    let cancelled = false;

    const measureId = measureIdRef.current + 1;
    measureIdRef.current = measureId;
    const stillCurrent = () => !cancelled && measureIdRef.current === measureId;

    const show = async () => {
      positioningRef.current = true;
      setRect(null);

      if (pathnameRef.current !== step.path) {
        router.push(step.path);
        if (stillCurrent()) positioningRef.current = false;
        return;
      }

      if (step.seriesModal) setSeriesModal(step.seriesModal === 'open');

      const element = await waitForTarget(step.target, step.seriesModal === 'open' ? 8000 : 4000, () => !stillCurrent());
      if (!stillCurrent() || !element) {
        if (stillCurrent()) positioningRef.current = false;
        return;
      }

      const header = document.querySelector('header');
      const headerHeight = header?.getBoundingClientRect().height ?? 96;
      const cardHeight = cardRef.current?.offsetHeight ?? 280;
      element.style.scrollMarginTop = `${headerHeight + 16}px`;
      element.style.scrollMarginBottom = `${cardHeight + 32}px`;
      releasePageScroll();
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });

      let previous = element.getBoundingClientRect();
      for (let attempt = 0; attempt < 12; attempt += 1) {
        await nextFrame();
        if (!stillCurrent()) return;
        const next = element.getBoundingClientRect();
        const stable =
          Math.abs(next.top - previous.top) < 1 &&
          Math.abs(next.left - previous.left) < 1 &&
          Math.abs(next.width - previous.width) < 1 &&
          Math.abs(next.height - previous.height) < 1;
        previous = next;
        if (stable && next.width > 2 && next.height > 2) break;
      }

      const box = highlightRect(element);
      if (stillCurrent() && box) setRect(box);
      if (stillCurrent()) {
        freezePageScroll();
        positioningRef.current = false;
      }
    };

    void show();
    return () => {
      cancelled = true;
    };
  }, [open, index, run, step, pathname, router]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const update = () => {
      if (positioningRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = GUIDE_STEPS[indexRef.current];
        if (!current || pathnameRef.current !== current.path) return;
        const element = findVisibleTarget(current.target);
        if (!element) return;
        const box = highlightRect(element);
        if (!box) return;
        setRect((prev) => {
          if (
            prev &&
            Math.abs(prev.top - box.top) < 1 &&
            Math.abs(prev.left - box.left) < 1 &&
            Math.abs(prev.width - box.width) < 1 &&
            Math.abs(prev.height - box.height) < 1
          ) {
            return prev;
          }
          return box;
        });
      });
    };
    const onMutate = (mutations: MutationRecord[]) => {
      const guide = document.querySelector('[data-guide-root]');
      const outsideGuide = mutations.some((mutation) => !(guide && guide.contains(mutation.target)));
      if (outsideGuide) update();
    };
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const observer = new MutationObserver(onMutate);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'data-state'] });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index]);

  useLayoutEffect(() => {
    if (!open || !rect) return;
    const card = cardRef.current;
    if (!card) return;
    const box = card.getBoundingClientRect();
    const next = placeCard(rect, box.width, box.height);
    setCardStyle((current) => (current.top === next.top && current.left === next.left ? current : next));
  }, [open, rect, index, step?.title]);

  useEffect(() => {
    if (!open) return;

    const active = document.activeElement;
    if (active instanceof HTMLElement && !cardRef.current?.contains(active)) active.blur();

    freezePageScroll();
    inertOutsideGuide();

    const observer = new MutationObserver(() => inertOutsideGuide());
    observer.observe(document.body, { childList: true });

    const isInsideCard = (target: EventTarget | null) =>
      target instanceof Node && !!cardRef.current?.contains(target);

    const blockPointer = (event: Event) => {
      if (isInsideCard(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const blockScroll = (event: Event) => {
      if (isInsideCard(event.target)) return;
      event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        finish();
        return;
      }
      if (event.key === 'Tab') {
        const card = cardRef.current;
        if (!card) return;
        const buttons = [...card.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        if (buttons.length === 0) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const activeButton = document.activeElement;
        event.preventDefault();
        if (event.shiftKey) {
          if (activeButton === first || !card.contains(activeButton)) last.focus();
          else {
            const current = buttons.indexOf(activeButton as HTMLButtonElement);
            buttons[Math.max(0, current - 1)]?.focus();
          }
        } else if (activeButton === last || !card.contains(activeButton)) {
          first.focus();
        } else {
          const current = buttons.indexOf(activeButton as HTMLButtonElement);
          buttons[Math.min(buttons.length - 1, current + 1)]?.focus();
        }
        return;
      }
      if ([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        if (event.key === ' ' && isInsideCard(event.target)) return;
        event.preventDefault();
      }
    };

    document.addEventListener('pointerdown', blockPointer, true);
    document.addEventListener('mousedown', blockPointer, true);
    document.addEventListener('click', blockPointer, true);
    document.addEventListener('touchstart', blockPointer, true);
    document.addEventListener('wheel', blockScroll, { capture: true, passive: false });
    document.addEventListener('touchmove', blockScroll, { capture: true, passive: false });
    document.addEventListener('keydown', blockKeys, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('pointerdown', blockPointer, true);
      document.removeEventListener('mousedown', blockPointer, true);
      document.removeEventListener('click', blockPointer, true);
      document.removeEventListener('touchstart', blockPointer, true);
      document.removeEventListener('wheel', blockScroll, true);
      document.removeEventListener('touchmove', blockScroll, true);
      document.removeEventListener('keydown', blockKeys, true);
      clearGuideInert();
      releasePageScroll();
    };
  }, [open]);

  if (!open || typeof document === 'undefined' || !step) return null;

  return createPortal(
    <div
      data-guide-root
      className="fixed inset-0 z-100 overflow-hidden"
      role="presentation"
      onPointerDown={(event) => {
        if (cardRef.current?.contains(event.target as Node)) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-md border-2 border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.62)]"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900/60" />
      )}
      <div
        ref={cardRef}
        data-guide-card
        role="dialog"
        aria-modal="true"
        aria-labelledby="mentor-add-content-tour-title"
        className={`absolute w-[min(22rem,calc(100vw-2rem))] rounded-md border border-slate-200 bg-white p-4 shadow-xl ${rect ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}
        style={{ top: cardStyle.top, left: cardStyle.left }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Add series and book · {index + 1} of {GUIDE_STEPS.length}
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-primary" style={{ width: `${((index + 1) / GUIDE_STEPS.length) * 100}%` }} />
        </div>
        <h2 id="mentor-add-content-tour-title" className="mt-3 text-base font-semibold text-slate-900">
          {step.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={finish}
            className="inline-flex h-9 items-center rounded-lg px-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
