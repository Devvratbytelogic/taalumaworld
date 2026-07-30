'use client';

import { useEffect } from 'react';
import { API_BASE_URL } from '@/utils/config';
import { getAuthToken } from '@/utils/authCookies';
import { store } from '@/store/store';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import toast from '@/utils/toast';

function getUpdatedChapterId(payload: unknown): string | null {
  if (payload === 'connected') return null;
  if (!payload || typeof payload !== 'object') return null;

  const data = payload as Record<string, unknown>;
  if (data.type === 'connected') return null;

  if (data.action === 'updated' && data.id != null) {
    return String(data.id);
  }

  return null;
}

function handleSseLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith(':')) return;

  const jsonText = trimmed.startsWith('data:')
    ? trimmed.replace(/^data:\s*/, '').trim()
    : trimmed;

  if (!jsonText || jsonText === '[DONE]') return;

  let payload: unknown;
  try {
    payload = JSON.parse(jsonText);
  } catch {
    return;
  }

  if (payload && typeof payload === 'object' && (payload as { type?: string }).type === 'connected') {
    console.log('[blueprint-sse] hello from stream');
    return;
  }

  const chapterId = getUpdatedChapterId(payload);
  if (!chapterId) return;

  console.log('[blueprint-sse] chapter updated', chapterId);

  window.setTimeout(() => {
    store.dispatch(rtkQuerieSetup.util.invalidateTags(['AdminChapters']));
  }, 400);
}


export function useBlueprintScoringEvents(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const token = getAuthToken();
    if (!token) {
      console.warn('[blueprint-sse] no auth token, skip connect');
      return;
    }

    let closed = false;
    let xhr: XMLHttpRequest | null = null;
    let seen = 0;
    let lineBuffer = '';
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const processNewText = (fullText: string) => {
      const chunk = fullText.slice(seen);
      seen = fullText.length;
      if (!chunk) return;

      lineBuffer += chunk.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const lines = lineBuffer.split('\n');
      lineBuffer = lines.pop() ?? '';
      for (const line of lines) handleSseLine(line);
    };

    const connect = () => {
      if (closed) return;

      seen = 0;
      lineBuffer = '';
      xhr = new XMLHttpRequest();
      xhr.open('GET', `${API_BASE_URL}/admin/blueprints/emit`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Accept', 'text/event-stream');
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.withCredentials = true;

      xhr.onreadystatechange = () => {
        if (!xhr || closed) return;
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
          console.log('[blueprint-sse] connected', xhr.status);
        }
      };

      xhr.onprogress = () => {
        if (!xhr || closed) return;
        processNewText(xhr.responseText);
      };

      xhr.onload = () => {
        if (!xhr || closed) return;
        processNewText(xhr.responseText);
        if (lineBuffer.trim()) handleSseLine(lineBuffer);
        console.warn('[blueprint-sse] stream ended, reconnecting…');
        scheduleReconnect();
      };

      xhr.onerror = () => {
        if (closed) return;
        console.error('[blueprint-sse] xhr error', xhr?.status);
        scheduleReconnect();
      };

      xhr.onabort = () => {
        console.warn('[blueprint-sse] aborted');
      };

      console.log('[blueprint-sse] connecting…');
      xhr.send();
    };

    const scheduleReconnect = () => {
      if (closed || reconnectTimer) return;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, 2000);
    };

    // Skip the Strict Mode mount/unmount pair so we only open one stream.
    startTimer = setTimeout(connect, 150);

    return () => {
      closed = true;
      if (startTimer) clearTimeout(startTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      xhr?.abort();
      xhr = null;
    };
  }, [enabled]);
}
