import { apiSlice } from "@/api/apiSlice";
import type {
  AuthResponse,
  SigninRequest,
  SignupRequest,
  SuccessResponse,
  TokenResponse,
  UserProfile,
} from "../auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    signin: builder.mutation<AuthResponse, SigninRequest>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    refresh: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    logout: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getMe: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApiSlice;
