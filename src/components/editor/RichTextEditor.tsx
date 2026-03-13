'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { useCallback, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Table as TableIcon,
  ImagePlus,
  Rows3,
  Columns3,
  Trash2,
} from 'lucide-react';
import { cn } from '@/components/ui/utils';

const MenuButton = ({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'p-2 rounded-lg transition-colors',
      active ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      disabled && 'opacity-50 cursor-not-allowed'
    )}
  >
    {children}
  </button>
);

function Toolbar({
  editor,
  onImageUpload,
}: {
  editor: Editor | null;
  onImageUpload?: (file: File) => void | Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onImageUpload?.(file);
    e.target.value = '';
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 1, cols: 1, withHeaderRow: true }).run();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30 rounded-t-2xl">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <div className="w-px h-5 bg-border mx-0.5" aria-hidden />
        <MenuButton
          onClick={insertTable}
          active={editor.isActive('table')}
          title="Insert table (3×3)"
        >
          <TableIcon className="h-4 w-4" />
        </MenuButton>
        {editor.isActive('table') && (
          <>
            <MenuButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add row below"
            >
              <Rows3 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add column after"
            >
              <Columns3 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete table"
            >
              <Trash2 className="h-4 w-4" />
            </MenuButton>
          </>
        )}
        <MenuButton onClick={() => fileInputRef.current?.click()} title="Upload image">
          <ImagePlus className="h-4 w-4" />
        </MenuButton>
        <div className="w-px h-5 bg-border mx-0.5" aria-hidden />
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>
    </>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
  /** Optional: custom image upload. If not provided, images are embedded as base64. */
  onImageUpload?: (file: File) => Promise<string>;
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
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
        resize: {
          enabled: true,
          minWidth: 80,
          minHeight: 80,
          alwaysPreserveAspectRatio: false,
        },
      }),
      Table.configure({
        HTMLAttributes: { class: 'border-collapse table w-full my-3' },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: { class: 'border-0 p-2 min-w-[80px]' },
      }),
      TableHeader.configure({
        HTMLAttributes: { class: 'border-0 p-2 bg-muted/50 font-semibold text-left' },
      }),
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'min-h-[200px] px-4 py-3 text-base text-foreground focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-2 [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto',
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const file = files[0];
        if (!file.type.startsWith('image/')) return false;
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (coordinates) {
            editor?.chain().focus().setImage({ src }).run();
          }
        };
        reader.readAsDataURL(file);
        return true;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const file = Array.from(items).find((item) => item.type.startsWith('image/'));
        if (!file) return false;
        const blob = file.getAsFile();
        if (!blob) return false;
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = () => {
          editor?.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(blob);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setContent = useCallback(
    (html: string) => {
      if (editor && html !== editor.getHTML()) {
        editor.commands.setContent(html || '', { emitUpdate: false });
      }
    },
    [editor]
  );

  useEffect(() => {
    setContent(value || '');
  }, [value, setContent]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;
      if (onImageUpload) {
        try {
          const src = await onImageUpload(file);
          editor.chain().focus().setImage({ src }).run();
        } catch {
          const reader = new FileReader();
          reader.onload = () => editor.chain().focus().setImage({ src: reader.result as string }).run();
          reader.readAsDataURL(file);
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => editor.chain().focus().setImage({ src: reader.result as string }).run();
        reader.readAsDataURL(file);
      }
    },
    [editor, onImageUpload]
  );

  return (
    <div
      className={cn(
        'border border-input rounded-2xl bg-input-background overflow-hidden transition-[color,box-shadow] focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50',
        className
      )}
      style={{ minHeight }}
    >
      <Toolbar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}
