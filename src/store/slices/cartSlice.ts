import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { ContentMode } from './contentModeSlice';

export interface CartItem {
  id: string; // chapterId or bookId
  type: 'chapter' | 'book';
  bookId?: string; // For chapters, to track which book they belong to
}

interface CartState {
  items: CartItem[];
  mode: ContentMode; // Track which mode the cart is in
}

// Load initial state from localStorage (SSR-safe: no localStorage on server)
const loadCartFromStorage = (): { items: CartItem[]; mode: ContentMode } => {
  if (typeof window === 'undefined' || typeof window.localStorage?.getItem !== 'function') {
    return { items: [], mode: 'chapters' };
  }
  try {
    const savedCart = window.localStorage.getItem('taaluma_cart');
    const savedMode = window.localStorage.getItem('display-mode');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const mode = (savedMode === 'books' || savedMode === 'chapters') ? savedMode : 'chapters';
      return { items: parsedCart, mode };
    }
    const mode = window.localStorage.getItem('display-mode');
    return { items: [], mode: (mode === 'books' || mode === 'chapters') ? mode : 'chapters' };
  } catch (e) {
    console.error('Failed to load cart:', e);
    return { items: [], mode: 'chapters' };
  }
};

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemContentMode: ContentMode = action.payload.type === 'chapter' ? 'chapters' : 'books';
      // Prevent mixing: If cart has items and mode doesn't match, clear cart first
      if (state.items.length > 0 && state.mode !== itemContentMode) {
        console.warn(`Clearing cart: switching from ${state.mode} mode to ${itemContentMode} mode`);
        state.items = [];
      }

      state.mode = itemContentMode;
      
      const exists = state.items.some(item => item.id === action.payload.id);
      
      if (!exists) {
        state.items.push(action.payload);
        if (typeof window !== 'undefined' && window.localStorage?.setItem) {
          window.localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('taaluma_cart', JSON.stringify([]));
      }
    },

    syncCartMode: (state, action: PayloadAction<ContentMode>) => {
      const newMode = action.payload;
      if (state.items.length > 0 && state.mode !== newMode) {
        console.warn(`Content mode changed to ${newMode}, clearing cart with ${state.mode} items`);
        state.items = [];
        if (typeof window !== 'undefined' && window.localStorage?.setItem) {
          window.localStorage.setItem('taaluma_cart', JSON.stringify([]));
        }
      }
      state.mode = newMode;
    },

    validateCart: (state, action: PayloadAction<{ ownedIds?: string[]; validIds?: string[] }>) => {
      const { ownedIds = [], validIds } = action.payload;
      state.items = state.items.filter(item => !ownedIds.includes(item.id));
      if (validIds) {
        state.items = state.items.filter(item => validIds.includes(item.id));
      }
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, syncCartMode, validateCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) => state.cart.items.length;
export const selectCartMode = (state: RootState) => state.cart.mode;
export const selectIsInCart = (id: string) => (state: RootState) =>
  state.cart.items.some(item => item.id === id);

export default cartSlice.reducer;
