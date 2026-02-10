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

function getInitialAuthState(): AuthState {
  if (typeof window === 'undefined' || typeof window.localStorage?.getItem !== 'function') {
    return { isAuthenticated: false, user: null };
  }
  const isAuth = window.localStorage.getItem('is_authenticated') === 'true';
  const email = window.localStorage.getItem('user_email');
  return {
    isAuthenticated: isAuth,
    user: email
      ? {
          email: window.localStorage.getItem('user_email') || '',
          fullName: window.localStorage.getItem('user_name') || '',
          photo: window.localStorage.getItem('user_photo') || undefined,
          role: 'user',
        }
      : null,
  };
}

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('is_authenticated', 'true');
        window.localStorage.setItem('user_email', action.payload.email);
        window.localStorage.setItem('user_name', action.payload.fullName);
        if (action.payload.photo) {
          window.localStorage.setItem('user_photo', action.payload.photo);
        }
      }
    },

    signUp: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      if (typeof window !== 'undefined' && window.localStorage?.setItem) {
        window.localStorage.setItem('is_authenticated', 'true');
        window.localStorage.setItem('user_email', action.payload.email);
        window.localStorage.setItem('user_name', action.payload.fullName);
        if (action.payload.photo) {
          window.localStorage.setItem('user_photo', action.payload.photo);
        }
      }
    },

    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      if (typeof window !== 'undefined' && window.localStorage?.removeItem) {
        window.localStorage.removeItem('is_authenticated');
        window.localStorage.removeItem('user_email');
        window.localStorage.removeItem('user_name');
        window.localStorage.removeItem('user_photo');
      }
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined' && window.localStorage) {
          if (action.payload.fullName) {
            window.localStorage.setItem('user_name', action.payload.fullName);
          }
          if (action.payload.photo !== undefined) {
            if (action.payload.photo) {
              window.localStorage.setItem('user_photo', action.payload.photo);
            } else {
              window.localStorage.removeItem('user_photo');
            }
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
