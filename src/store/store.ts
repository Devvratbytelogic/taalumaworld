import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import cartReducer from './slices/cartSlice';
import contentModeReducer from './slices/contentModeSlice';
import readingReducer from './slices/readingSlice';
import allModalSlice from './slices/allModalSlice';
import chapterPurchaseReducer from './slices/chapterPurchaseSlice';
import { rtkQuerieSetup } from "./services/rtkQuerieSetup";

export const store = configureStore({
  reducer: {
    [rtkQuerieSetup.reducerPath]: rtkQuerieSetup.reducer,
    allModal: allModalSlice,
    chapterPurchase: chapterPurchaseReducer,
    cart: cartReducer,
    contentMode: contentModeReducer,
    reading: readingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // The shared confirmation modals (DeleteConfirmation/RestoreConfirmation, etc.)
      // are opened via `openModal({ data: { onDelete/onRestore: () => ... } } })`,
      // which intentionally stores a callback function in the store's `data` field.
      serializableCheck: {
        // Modal callbacks in openModal payload; FormData bodies in RTK Query mutations
        // (create/update chapter, profile pic, etc.) live on meta.arg.
        ignoredActions: ['allCommonModal/openModal'],
        ignoredActionPaths: ['payload.data', 'meta.arg', 'meta.baseQueryMeta'],
        ignoredPaths: ['allModal.data'],
      },
    }).concat(rtkQuerieSetup.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;