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

// Load initial state from localStorage
const loadCartFromStorage = (): { items: CartItem[], mode: ContentMode } => {
  try {
    const savedCart = localStorage.getItem('taaluma_cart');
    const savedMode = localStorage.getItem('display-mode');
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const mode = (savedMode === 'books' || savedMode === 'chapters') ? savedMode : 'chapters';
      return { items: parsedCart, mode };
    }
  } catch (e) {
    console.error('Failed to load cart:', e);
  }
  
  const mode = localStorage.getItem('display-mode');
  return { 
    items: [], 
    mode: (mode === 'books' || mode === 'chapters') ? mode : 'chapters' 
  };
};

const initialState: CartState = loadCartFromStorage();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // Prevent mixing: If cart has items and mode doesn't match, clear cart first
      if (state.items.length > 0 && state.mode !== action.payload.type) {
        console.warn(`Clearing cart: switching from ${state.mode} mode to ${action.payload.type} mode`);
        state.items = [];
      }
      
      // Set cart mode based on item type
      state.mode = action.payload.type === 'chapter' ? 'chapters' : 'books';
      
      const exists = state.items.some(item => item.id === action.payload.id);
      
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
      }
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
    },
    
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('taaluma_cart', JSON.stringify([]));
    },
    
    // Update cart mode when content mode changes
    syncCartMode: (state, action: PayloadAction<ContentMode>) => {
      // If mode changed and cart has items of wrong type, clear cart
      const newMode = action.payload;
      if (state.items.length > 0 && state.mode !== newMode) {
        console.warn(`Content mode changed to ${newMode}, clearing cart with ${state.mode} items`);
        state.items = [];
        localStorage.setItem('taaluma_cart', JSON.stringify([]));
      }
      state.mode = newMode;
    },
    
    // Validate cart by removing owned items
    validateCart: (state, action: PayloadAction<{ ownedIds?: string[]; validIds?: string[] }>) => {
      const { ownedIds = [], validIds } = action.payload;
      
      // Remove owned items from cart
      state.items = state.items.filter(item => !ownedIds.includes(item.id));
      
      // If valid IDs provided, remove invalid items
      if (validIds) {
        state.items = state.items.filter(item => validIds.includes(item.id));
      }
      
      localStorage.setItem('taaluma_cart', JSON.stringify(state.items));
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
