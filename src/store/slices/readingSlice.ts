import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface ReadingProgress {
  [chapterId: string]: {
    progress: number;
    lastRead: string;
  };
}

interface ReadingState {
  progress: ReadingProgress;
  currentChapter: string | null;
}

const loadProgressFromStorage = (): ReadingProgress => {
  try {
    const saved = localStorage.getItem('reading_progress');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load reading progress:', e);
  }
  return {};
};

const initialState: ReadingState = {
  progress: loadProgressFromStorage(),
  currentChapter: null,
};

export const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<{ chapterId: string; progress: number }>) => {
      state.progress[action.payload.chapterId] = {
        progress: action.payload.progress,
        lastRead: new Date().toISOString(),
      };
      localStorage.setItem('reading_progress', JSON.stringify(state.progress));
    },

    setCurrentChapter: (state, action: PayloadAction<string | null>) => {
      state.currentChapter = action.payload;
    },

    clearProgress: (state, action: PayloadAction<string>) => {
      delete state.progress[action.payload];
      localStorage.setItem('reading_progress', JSON.stringify(state.progress));
    },
  },
});

export const { updateProgress, setCurrentChapter, clearProgress } = readingSlice.actions;

// Selectors
export const selectReadingProgress = (state: RootState) => state.reading.progress;
export const selectChapterProgress = (chapterId: string) => (state: RootState) =>
  state.reading.progress[chapterId]?.progress || 0;
export const selectCurrentChapter = (state: RootState) => state.reading.currentChapter;

export default readingSlice.reducer;
