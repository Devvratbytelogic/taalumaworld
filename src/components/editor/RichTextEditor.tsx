'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  imagePlugin,
  toolbarPlugin,
  KitchenSinkToolbar,
} from '@mdxeditor/editor';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useRef, useEffect, useMemo } from 'react';
import { cn } from '@/components/ui/utils';

function createEditorPlugins(imageUploadHandler: (file: File) => Promise<string>) {
  return [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    tablePlugin(),
    imagePlugin({
      imageUploadHandler,
    }),
    toolbarPlugin({
      toolbarContents: () => <KitchenSinkToolbar />,
    }),
  ];
}

export interface RichTextEditorProps {
  /** Markdown content (MDXEditor uses markdown, not HTML). */
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
  /** Optional: custom image upload. If not provided, images are embedded as base64 data URLs. */
  onImageUpload?: (file: File) => Promise<string>;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your chapter content here...',
  disabled = false,
  minHeight = '280px',
  className,
  onImageUpload,
}: RichTextEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);
  const onImageUploadRef = useRef(onImageUpload);
  onImageUploadRef.current = onImageUpload;

  const editorPlugins = useMemo(
    () =>
      createEditorPlugins(async (file: File) => {
        const handler = onImageUploadRef.current;
        if (handler) {
          try {
            return await handler(file);
          } catch {
            return fileToDataUrl(file);
          }
        }
        return fileToDataUrl(file);
      }),
    []
  );

  useEffect(() => {
    if (ref.current && value !== undefined && value !== null) {
      ref.current.setMarkdown(value);
    }
  }, [value]);

  return (
    <div
      className={cn(
        'border border-input rounded-2xl bg-input-background overflow-hidden transition-[color,box-shadow] focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50',
        className
      )}
      style={{ minHeight }}
    >
      <MDXEditor
        ref={ref}
        markdown={value ?? ''}
        onChange={(markdown) => onChange(markdown)}
        placeholder={placeholder}
        readOnly={disabled}
        plugins={editorPlugins}
        contentEditableClassName="min-h-[200px] px-4 py-3 text-base text-foreground focus:outline-none prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2"
      />
    </div>
  );
}
