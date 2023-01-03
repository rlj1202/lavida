import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../schemas/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
