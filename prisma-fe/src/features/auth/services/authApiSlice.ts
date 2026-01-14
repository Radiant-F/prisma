import { apiSlice } from "@/api/apiSlice";
import type { LoginRequest, LoginResponse } from "../auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
