import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthState, User } from "../auth";

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      accessToken: null,
      user: null,
      isReady: false,
    };
  }

  const accessToken = localStorage.getItem("accessToken");
  const userRaw = localStorage.getItem("user");
  let user: User | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User;
    } catch {
      user = null;
    }
  }

  return {
    isAuthenticated: Boolean(accessToken),
    accessToken,
    user,
    isReady: false,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isReady = true;
      // Persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.isReady = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload);
      }
    },
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
      return {
        isAuthenticated: false,
        accessToken: null,
        user: null,
        isReady: true,
      };
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  logout,
  updateUser,
  setAuthReady,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
