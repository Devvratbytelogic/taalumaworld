import { cn } from './utils';

export const fieldFocusClassName =
  'focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/10';

export const fieldInvalidClassName =
  'border-red-300 focus-visible:border-red-300 focus-visible:ring-red-100';

const fieldBaseClassName = cn(
  'w-full min-w-0 rounded-md border border-gray-200 bg-white text-sm text-gray-900 shadow-none',
  'placeholder:text-gray-400 transition-[color,box-shadow] outline-none',
  'disabled:cursor-not-allowed disabled:opacity-50',
  fieldFocusClassName,
  'aria-invalid:border-red-300 aria-invalid:focus-visible:border-red-300 aria-invalid:focus-visible:ring-red-100'
);

export const inputClassName = cn(fieldBaseClassName, 'flex h-10 px-3 py-2');

export const textareaClassName = cn(
  fieldBaseClassName,
  'field-sizing-content min-h-28 resize-none px-3 py-2.5'
);

export const nativeSelectClassName = cn(fieldBaseClassName, 'flex h-10 px-3 py-2');

export const selectTriggerClassName = cn(
  fieldBaseClassName,
  'flex h-10 items-center justify-between gap-2 px-3 py-2 whitespace-nowrap',
  'data-[placeholder]:text-gray-400 [&_svg:not([class*="text-"])]:text-gray-400',
  'disabled:cursor-not-allowed disabled:opacity-50',
  '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
  '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4'
);
