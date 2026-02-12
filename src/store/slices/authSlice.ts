import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  fullName: string;
  email: string;
  photo?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<AuthUser | undefined>) => {
      state.isAuthenticated = true;
      state.user = action.payload ?? {
        fullName: 'User',
        email: 'user@example.com',
        photo: null,
      };
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuthenticated, signOut } = authSlice.actions;
export default authSlice.reducer;
