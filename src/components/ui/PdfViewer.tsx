'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  url: string;
  title?: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-sm animate-pulse">Loading PDF…</p>
          </div>
        }
        error={
          <div className="flex items-center justify-center py-16">
            <p className="text-destructive text-sm">Failed to load PDF.</p>
          </div>
        }
      >
        {containerWidth > 0 &&
          Array.from({ length: numPages }, (_, i) => (
            <div key={i + 1} className="mb-3 shadow-sm overflow-hidden rounded-sm">
              <Page
                pageNumber={i + 1}
                width={containerWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
