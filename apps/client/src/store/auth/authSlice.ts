import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../schemas/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
    },
    setAuthInfo(
      state,
      action: PayloadAction<{
        user?: User | null;
        accessToken?: string | null;
        refreshToken?: string | null;
      }>,
    ) {
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload.accessToken !== undefined) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    clearAuthInfo(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  setAuthInfo,
  clearAuthInfo,
} = authSlice.actions;

export default authSlice.reducer;
