import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type ContentMode = 'chapters' | 'books';

interface ContentModeState {
  mode: ContentMode;
}

const loadModeFromStorage = (): ContentMode => {
  if (typeof window === 'undefined' || typeof window.localStorage?.getItem !== 'function') {
    return 'chapters';
  }
  const storage = window.localStorage;
  // First check the new key
  let savedMode = storage.getItem('display-mode');
  
  // If not found, check the old key for migration
  if (!savedMode) {
    savedMode = storage.getItem('taaluma_content_mode');
    if (savedMode) {
      // Migrate from old key to new key
      storage.setItem('display-mode', savedMode);
      storage.removeItem('taaluma_content_mode');
    }
  }
  
  if (savedMode === 'books' || savedMode === 'chapters') {
    return savedMode;
  }
  return 'chapters';
};

const initialState: ContentModeState = {
  mode: loadModeFromStorage(),
};

export const contentModeSlice = createSlice({
  name: 'contentMode',
  initialState,
  reducers: {
    setContentMode: (state, action: PayloadAction<ContentMode>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
        window.localStorage.setItem('display-mode', action.payload);
      }
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('displayModeChange', { detail: action.payload }));
      }
    },
    
    toggleContentMode: (state) => {
      state.mode = state.mode === 'chapters' ? 'books' : 'chapters';
      if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
        window.localStorage.setItem('display-mode', state.mode);
      }
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('displayModeChange', { detail: state.mode }));
      }
    },
  },
});

export const { setContentMode, toggleContentMode } = contentModeSlice.actions;

// Selectors
export const selectContentMode = (state: RootState) => state.contentMode.mode;

export default contentModeSlice.reducer;