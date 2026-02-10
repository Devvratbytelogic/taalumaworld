import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface User {
  email: string;
  fullName: string;
  photo?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('is_authenticated') === 'true',
  user: localStorage.getItem('user_email')
    ? {
        email: localStorage.getItem('user_email') || '',
        fullName: localStorage.getItem('user_name') || '',
        photo: localStorage.getItem('user_photo') || '',
        role: 'user',
      }
    : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      
      // Persist to localStorage
      localStorage.setItem('is_authenticated', 'true');
      localStorage.setItem('user_email', action.payload.email);
      localStorage.setItem('user_name', action.payload.fullName);
      if (action.payload.photo) {
        localStorage.setItem('user_photo', action.payload.photo);
      }
    },
    
    signUp: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      
      // Persist to localStorage
      localStorage.setItem('is_authenticated', 'true');
      localStorage.setItem('user_email', action.payload.email);
      localStorage.setItem('user_name', action.payload.fullName);
      if (action.payload.photo) {
        localStorage.setItem('user_photo', action.payload.photo);
      }
    },
    
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      
      // Clear localStorage
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_photo');
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (action.payload.fullName) {
          localStorage.setItem('user_name', action.payload.fullName);
        }
        if (action.payload.photo !== undefined) {
          if (action.payload.photo) {
            localStorage.setItem('user_photo', action.payload.photo);
          } else {
            localStorage.removeItem('user_photo');
          }
        }
      }
    },
  },
});

export const { signIn, signUp, signOut, updateUser } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
