'use client';

import { useEffect, useRef } from 'react';

const DFLIP_BASE = '/dflip/';

declare global {
  interface Window {
    jQuery?: {
      (element: HTMLElement): {
        flipBook: (source: string, options?: Record<string, unknown>) => DearFlipInstance;
      };
      fn?: {
        flipBook?: unknown;
      };
    };
    dFlipLocation?: string;
    DFLIP?: {
      defaults?: Record<string, string>;
    };
    THREE?: unknown;
    MOCKUP?: unknown;
  }
}

interface DearFlipInstance {
  dispose?: () => void;
  resize?: () => void;
}

interface UseDearFlipOptions {
  pdfUrl: string;
  title?: string;
  height?: number | string;
  onReady?: () => void;
}

const SCRIPT_ATTR = 'data-dearflip-script';

let dearFlipAssetsPromise: Promise<void> | null = null;

if (typeof window !== 'undefined') {
  window.dFlipLocation = DFLIP_BASE;
}

function patchDearFlipDefaults() {
  window.dFlipLocation = DFLIP_BASE;

  if (!window.DFLIP?.defaults) return;

  Object.assign(window.DFLIP.defaults, {
    threejsSrc: `${DFLIP_BASE}js/libs/three.min.js`,
    pdfjsSrc: `${DFLIP_BASE}js/libs/pdf.min.js`,
    pdfjsWorkerSrc: `${DFLIP_BASE}js/libs/pdf.worker.min.js`,
    pdfjsCompatibilitySrc: `${DFLIP_BASE}js/libs/compatibility.js`,
    mockupjsSrc: `${DFLIP_BASE}js/libs/mockup.min.js`,
    soundFile: `${DFLIP_BASE}sound/turn2.mp3`,
    soundEnable: true,
    imagesLocation: `${DFLIP_BASE}images`,
    imageResourcesPath: `${DFLIP_BASE}images/pdfjs/`,
    cMapUrl: `${DFLIP_BASE}js/libs/cmaps/`,
  });
}

function loadStyle(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  document.head.appendChild(link);
}

function waitFor(check: () => boolean, timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const poll = () => {
      if (check()) {
        resolve();
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error('Timed out waiting for DearFlip dependencies.'));
        return;
      }

      window.setTimeout(poll, 20);
    };

    poll();
  });
}

function loadScriptOnce(id: string, src: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}="${id}"]`);

  if (existing) {
    if (existing.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true },
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute(SCRIPT_ATTR, id);
    script.async = false;
    script.defer = false;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

async function ensureDearFlipAssets() {
  window.dFlipLocation = DFLIP_BASE;

  if (!dearFlipAssetsPromise) {
    dearFlipAssetsPromise = (async () => {
      loadStyle(`${DFLIP_BASE}css/themify-icons.min.css`);
      loadStyle(`${DFLIP_BASE}css/dflip.min.css`);

      await loadScriptOnce('jquery', `${DFLIP_BASE}js/libs/jquery.min.js`);
      await waitFor(() => Boolean(window.jQuery));

      await loadScriptOnce('dflip', `${DFLIP_BASE}js/dflip.min.js`);
      await waitFor(() => Boolean(window.jQuery?.fn?.flipBook));

      // DearFlip WebGL loader uses global DFLIP.defaults — not per-instance options
      patchDearFlipDefaults();

      await loadScriptOnce('three', `${DFLIP_BASE}js/libs/three.min.js`);
      await loadScriptOnce('mockup', `${DFLIP_BASE}js/libs/mockup.min.js`);
      await loadScriptOnce('pdfjs', `${DFLIP_BASE}js/libs/pdf.min.js`);
    })().catch((error) => {
      dearFlipAssetsPromise = null;
      throw error;
    });
  } else {
    await dearFlipAssetsPromise;
    patchDearFlipDefaults();
  }

  return dearFlipAssetsPromise;
}

function getDearFlipOptions(title?: string, height: number | string = 720) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return {
    webgl: true,
    height,
    backgroundColor: 'rgb(229, 229, 229)',
    autoEnableOutline: false,
    autoEnableThumbnail: false,
    overwritePDFOutline: false,
    soundEnable: true,
    autoPlay: false,
    autoPlayStart: false,
    hard: 'none',
    maxTextureSize: 3200,
    pageMode: isMobile ? 1 : 0,
    singlePageMode: isMobile ? 1 : 0,
    responsive: true,
    transparent: false,
    direction: 1,
    duration: 800,
    scrollWheel: false,
    controlsFloating: true,
    controlsPosition: 'bottom',
    showDownloadControl: true,
    showSearchControl: false,
    showPrintControl: true,
    zoomRatio: 1.5,
    fakeZoom: 2,
    flexibility: 1.5,
    cover3DType: 'ridge',
    color3DCover: '#aaaaaa',
    color3DSheets: '#ffffff',
    paddingTop: 40,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
    enableAnalytics: false,
    title: title ?? 'PDF Flipbook',
  };
}

function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };

  return (
    doc.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.mozFullScreenElement ??
    doc.msFullscreenElement ??
    null
  );
}

function resetFlipbookContainerStyles(container: HTMLElement) {
  const dfContainer = container.querySelector<HTMLElement>('.df-container');
  if (!dfContainer || getFullscreenElement()) return;

  dfContainer.classList.remove('df-fullscreen');

  dfContainer.style.removeProperty('position');
  dfContainer.style.removeProperty('top');
  dfContainer.style.removeProperty('left');
  dfContainer.style.removeProperty('right');
  dfContainer.style.removeProperty('bottom');
  dfContainer.style.removeProperty('width');
  dfContainer.style.removeProperty('height');
  dfContainer.style.removeProperty('max-width');
  dfContainer.style.removeProperty('max-height');
  dfContainer.style.removeProperty('margin');
  dfContainer.style.removeProperty('z-index');
}

function scheduleFlipbookResize(flipbook: DearFlipInstance | null, container: HTMLElement) {
  if (!flipbook?.resize) return;

  const run = () => {
    resetFlipbookContainerStyles(container);
    flipbook.resize?.();
  };

  run();
  window.setTimeout(run, 50);
  window.setTimeout(run, 200);
  window.setTimeout(run, 500);
}

function setupFlipbookLayoutSync(
  flipbook: DearFlipInstance,
  container: HTMLElement,
): () => void {
  const onFullscreenChange = () => {
    if (getFullscreenElement()) return;
    scheduleFlipbookResize(flipbook, container);
  };

  const fullscreenEvents = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange',
  ] as const;

  fullscreenEvents.forEach((event) => document.addEventListener(event, onFullscreenChange));

  const onWindowResize = () => {
    if (getFullscreenElement()) return;
    window.setTimeout(() => flipbook.resize?.(), 50);
  };

  window.addEventListener('resize', onWindowResize);

  return () => {
    fullscreenEvents.forEach((event) => document.removeEventListener(event, onFullscreenChange));
    window.removeEventListener('resize', onWindowResize);
  };
}

function watchFlipbookReady(container: HTMLElement, onReady?: () => void): () => void {
  if (!onReady) return () => {};

  if (container.querySelector('.df-init, .df-book-wrapper')) {
    onReady();
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (container.querySelector('.df-init, .df-book-wrapper')) {
      onReady();
      observer.disconnect();
    }
  });

  observer.observe(container, { childList: true, subtree: true });

  const timeoutId = window.setTimeout(() => {
    onReady();
    observer.disconnect();
  }, 20000);

  return () => {
    observer.disconnect();
    window.clearTimeout(timeoutId);
  };
}

export function useDearFlip(
  containerRef: React.RefObject<HTMLDivElement | null>,
  { pdfUrl, title, height = 720, onReady }: UseDearFlipOptions,
) {
  const flipbookRef = useRef<DearFlipInstance | null>(null);
  const onReadyRef = useRef(onReady);
  const initIdRef = useRef(0);

  onReadyRef.current = onReady;

  useEffect(() => {
    if (!pdfUrl || !containerRef.current) return;

    const container = containerRef.current;
    const initId = initIdRef.current + 1;
    initIdRef.current = initId;
    let cancelled = false;
    let disconnectReadyObserver: () => void = () => {};
    let disconnectLayoutSync: () => void = () => {};

    const initFlipbook = async () => {
      try {
        await ensureDearFlipAssets();
        patchDearFlipDefaults();

        if (cancelled || initIdRef.current !== initId || !containerRef.current || !window.jQuery) {
          return;
        }

        if (flipbookRef.current?.dispose) {
          flipbookRef.current.dispose();
          flipbookRef.current = null;
        }

        container.innerHTML = '';

        flipbookRef.current = window
          .jQuery(container)
          .flipBook(pdfUrl, getDearFlipOptions(title, height));

        disconnectLayoutSync = setupFlipbookLayoutSync(flipbookRef.current, container);

        disconnectReadyObserver = watchFlipbookReady(container, () => {
          if (!cancelled && initIdRef.current === initId) {
            onReadyRef.current?.();
          }
        });
      } catch (error) {
        console.error('DearFlip initialization failed:', error);
        if (!cancelled && initIdRef.current === initId) {
          onReadyRef.current?.();
        }
      }
    };

    initFlipbook();

    return () => {
      cancelled = true;
      disconnectLayoutSync();
      disconnectReadyObserver();
      if (flipbookRef.current?.dispose) {
        flipbookRef.current.dispose();
        flipbookRef.current = null;
      }
      container.innerHTML = '';
    };
  }, [containerRef, pdfUrl, title, height]);

  return flipbookRef;
}
