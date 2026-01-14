import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse } from "../auth";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        isAuthenticated: false,
        token: null,
        user: null,
      };
    },
    updateUser: (state, action: PayloadAction<LoginResponse["user"]>) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export const authReducer = authSlice.reducer;
