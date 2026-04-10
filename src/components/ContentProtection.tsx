"use client";

import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;
  const el = target as HTMLElement;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Deters casual context-menu / shortcut / copy use. Does not provide real security;
 * anything sent to the browser can still be accessed.
 *
 * Browsers often ignore preventDefault() for DevTools shortcuts (Cmd+Option+I, F12, etc.)
 * so those chords may still open the inspector — that is intentional in Chrome/Firefox/Safari.
 */
export function ContentProtection() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlUserSelect = html.style.userSelect;
    const prevBodyUserSelect = body.style.userSelect;
    html.style.userSelect = "none";
    body.style.userSelect = "none";

    const handleContextMenu = (e: MouseEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleSelectStart = (e: Event) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (key === "c" || key === "x")) {
        e.preventDefault();
        return;
      }

      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Use e.code (physical key) — on macOS, Option changes e.key so "i" may not match.
      if (e.ctrlKey && e.shiftKey) {
        if (e.code === "KeyI" || e.code === "KeyJ" || e.code === "KeyC") {
          e.preventDefault();
          return;
        }
      }

      if (e.ctrlKey && !e.shiftKey && !e.altKey && key === "u") {
        e.preventDefault();
        return;
      }

      // Cmd+Option+I/J/C (macOS DevTools) — same physical keys as above.
      if (e.metaKey && e.altKey) {
        if (e.code === "KeyI" || e.code === "KeyJ" || e.code === "KeyC") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCut, true);
    document.addEventListener("cut", handleCopyCut, true);
    document.addEventListener("selectstart", handleSelectStart, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      html.style.userSelect = prevHtmlUserSelect;
      body.style.userSelect = prevBodyUserSelect;
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCut, true);
      document.removeEventListener("cut", handleCopyCut, true);
      document.removeEventListener("selectstart", handleSelectStart, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return null;
}
