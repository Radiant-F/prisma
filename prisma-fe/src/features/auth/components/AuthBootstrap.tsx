import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  useLazyGetMeQuery,
  useRefreshMutation,
} from "../services/authApiSlice";
import {
  setAccessToken,
  setAuthReady,
  updateUser,
} from "../services/authReducer";

export const AuthBootstrap = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [refresh] = useRefreshMutation();
  const [getMe] = useLazyGetMeQuery();

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      let token = accessToken;

      if (!token) {
        try {
          const refreshResult = await refresh().unwrap();
          if (!active) return;
          token = refreshResult.accessToken;
          dispatch(setAccessToken(token));
        } catch {
          if (active) {
            dispatch(setAuthReady(true));
          }
          return;
        }
      }

      if (!user && token) {
        try {
          const profile = await getMe().unwrap();
          if (!active) return;
          dispatch(updateUser({ id: profile.id, username: profile.username }));
        } catch {
          if (active) {
            dispatch(setAuthReady(true));
          }
          return;
        }
      }

      if (active) {
        dispatch(setAuthReady(true));
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, [accessToken, dispatch, getMe, refresh, user]);

  return null;
};
