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
import { memo, useRef, useEffect, useMemo } from 'react';
import toast from '@/utils/toast';
import { IMAGE_UPLOAD_MAX_BYTES, getImageSizeLimitMessage } from '@/constants/fileUpload';

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
  /** Minimum content-area height. Editor grows with content beyond this (like Textarea). */
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

function RichTextEditorComponent({
  value,
  onChange,
  placeholder = 'Write your blueprint content here...',
  disabled = false,
  // Match Textarea `min-h-28` so the empty state feels like a normal multi-line field.
  minHeight = '10rem',
  className,
  onImageUpload,
}: RichTextEditorProps) {
  const ref = useRef<MDXEditorMethods>(null);
  const onImageUploadRef = useRef(onImageUpload);
  onImageUploadRef.current = onImageUpload;
  // Tracks the markdown value last emitted by this editor's own onChange, so
  // the sync effect below can tell "user typed here" apart from "value changed
  // externally" (e.g. loading chapter data, resetForm) and only call
  // setMarkdown for the latter. Calling setMarkdown on every keystroke forces
  // MDXEditor to fully re-parse and reset its internal editor state, which is
  // what caused the typing lag / cursor jumps.
  const lastEmittedValueRef = useRef(value);

  const editorPlugins = useMemo(
    () =>
      createEditorPlugins(async (file: File) => {
        if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
          toast.error(getImageSizeLimitMessage());
          throw new Error(getImageSizeLimitMessage());
        }
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
    if (ref.current && value !== undefined && value !== null && value !== lastEmittedValueRef.current) {
      ref.current.setMarkdown(value);
    }
    lastEmittedValueRef.current = value;
  }, [value]);

  return (
    <div
      data-slot="rich-text-editor"
      className={`${className} resize-y overflow-auto border border-slate-200 bg-white`}
      // style={{
      //   minHeight,
      // }}
    >
      <MDXEditor
        ref={ref}
        markdown={value ?? ''}
        onChange={(markdown) => {
          lastEmittedValueRef.current = markdown;
          onChange(markdown);
        }}
        placeholder={placeholder}
        readOnly={disabled}
        plugins={editorPlugins}
        contentEditableClassName="rte-content px-4 py-3 text-base text-foreground focus:outline-none prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2"
      />
    </div>
  );
}

export const RichTextEditor = memo(RichTextEditorComponent);
