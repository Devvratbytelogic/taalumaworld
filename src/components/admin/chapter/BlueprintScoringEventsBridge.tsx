'use client';

import { useBlueprintScoringEvents } from '@/hooks/useBlueprintScoringEvents';

/** Keeps the AI-scoring SSE connection open for admin/mentor blueprint screens. */
export function BlueprintScoringEventsBridge() {
  useBlueprintScoringEvents(true);
  return null;
}
