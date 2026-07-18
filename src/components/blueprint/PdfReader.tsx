'use client';

import { useEffect, useRef, useState } from 'react';
import { useDearFlip } from '@/hooks/useDearFlip';
import { useFlipProgress } from '@/hooks/useFlipProgress';
import './pdf-flipbook.css';

interface PdfReaderProps {
  url: string;
  title: string;
  /** Called whenever the viewed-pages percentage changes (0-100). */
  onProgressChange?: (progress: number) => void;
}

export default function PdfReader({ url, title, onProgressChange }: PdfReaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { progress, onFlip } = useFlipProgress();

  useEffect(() => {
    onProgressChange?.(progress);
  }, [progress, onProgressChange]);

  // Defer flipbook init (and therefore flip/progress tracking) until the reader
  // actually scrolls into view, so unopened PDFs don't report any pages viewed.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  useDearFlip(containerRef, {
    pdfUrl: isVisible ? url : '',
    title,
    height: 720,
    onFlip,
  });
  return (
    <div ref={rootRef} className="dearflip-reader-root">
      <div ref={containerRef} className="dearflip-reader-container" aria-label={title} />
    </div>
  );
}
