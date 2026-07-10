'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    jQuery?: {
      (element: HTMLElement): {
        flipBook: (source: string, options?: Record<string, unknown>) => DearFlipInstance;
      };
    };
    dFlipLocation?: string;
  }
}

interface DearFlipInstance {
  dispose?: () => void;
}

interface UseDearFlipOptions {
  pdfUrl: string;
  title?: string;
  height?: number | string;
}

function loadStyle(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
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
    autoPlayDuration: 5000,
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
    showSearchControl: true,
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

export function useDearFlip(
  containerRef: React.RefObject<HTMLDivElement | null>,
  { pdfUrl, title, height = 720 }: UseDearFlipOptions,
) {
  const flipbookRef = useRef<DearFlipInstance | null>(null);

  useEffect(() => {
    if (!pdfUrl || !containerRef.current) return;

    const container = containerRef.current;
    let cancelled = false;

    const initFlipbook = async () => {
      try {
        window.dFlipLocation = '/dflip/';

        loadStyle('/dflip/css/themify-icons.min.css');
        loadStyle('/dflip/css/dflip.min.css');

        await loadScript('/dflip/js/libs/jquery.min.js');
        await loadScript('/dflip/js/dflip.min.js');

        if (cancelled || !containerRef.current || !window.jQuery) return;

        if (flipbookRef.current?.dispose) {
          flipbookRef.current.dispose();
          flipbookRef.current = null;
        }

        container.innerHTML = '';

        flipbookRef.current = window
          .jQuery(container)
          .flipBook(pdfUrl, getDearFlipOptions(title, height));
      } catch (error) {
        console.error('DearFlip initialization failed:', error);
      }
    };

    initFlipbook();

    return () => {
      cancelled = true;
      if (flipbookRef.current?.dispose) {
        flipbookRef.current.dispose();
        flipbookRef.current = null;
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [containerRef, pdfUrl, title, height]);

  return flipbookRef;
}
