'use client';

import { useRef } from 'react';
import { useDearFlip } from '@/hooks/useDearFlip';
import './pdf-flipbook.css';

interface PdfReaderProps {
  url: string;
  title: string;
}

export default function PdfReader({ url, title }: PdfReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('url', url);
  console.log('url', url);
  useDearFlip(containerRef, {
    pdfUrl: url,
    title,
    height: 720,
  });

  return (
    <div className="dearflip-reader-root">
      <div ref={containerRef} className="dearflip-reader-container" aria-label={title} />
    </div>
  );
}
