import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChapterPurchaseState {
  lastPurchasedChapterId: string | null;
}

const initialState: ChapterPurchaseState = {
  lastPurchasedChapterId: null,
};

const chapterPurchaseSlice = createSlice({
  name: 'chapterPurchase',
  initialState,
  reducers: {
    setChapterPurchased: (state, action: PayloadAction<string>) => {
      state.lastPurchasedChapterId = action.payload;
    },
    clearChapterPurchased: (state) => {
      state.lastPurchasedChapterId = null;
    },
  },
});

export const { setChapterPurchased, clearChapterPurchased } = chapterPurchaseSlice.actions;
export default chapterPurchaseSlice.reducer;
