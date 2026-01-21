import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import FormInput from "@/features/auth/components/FormInput";
import {
  useSigninMutation,
  useSignupMutation,
} from "@/features/auth/services/authApiSlice";
import { setCredentials } from "@/features/auth/services/authReducer";
import { useForm } from "react-hook-form";

interface AuthFormValues {
  username: string;
  password: string;
  confirmPassword?: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isReady } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [signin, signinState] = useSigninMutation();
  const [signup, signupState] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AuthFormValues>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = signinState.isLoading || signupState.isLoading;
  const isBusy = isLoading || isSubmitting || !isReady;

  const subtitle = useMemo(() => {
    if (mode === "signup") {
      return "Create your account to start organizing your day.";
    }

    return "Welcome back — let's get you signed in.";
  }, [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    reset({ username: "", password: "", confirmPassword: "" });
    setErrorMessage(null);
  }, [mode, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null);

    try {
      if (mode === "signup") {
        const response = await signup({
          username: data.username,
          password: data.password,
        }).unwrap();
        dispatch(setCredentials(response));
      } else {
        const response = await signin({
          username: data.username,
          password: data.password,
        }).unwrap();
        dispatch(setCredentials(response));
      }

      navigate("/home");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Unable to authenticate. Please try again.";
      setErrorMessage(message);
    }
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center theme-page p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob bg-[var(--blob-1)]"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-[var(--blob-2)]"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000 bg-[var(--blob-3)]"></div>

      {/* Glass Card */}
      <div className="w-full max-w-md theme-card backdrop-blur-xl border rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm theme-muted">
            {!isReady ? "Checking your session..." : subtitle}
          </p>
        </div>

        <div className="flex items-center theme-ghost border rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("signin")}
            disabled={!isReady}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-[var(--ghost-hover)] text-[var(--text-primary)]"
                : "theme-muted hover:text-[var(--text-primary)]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            disabled={!isReady}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-[var(--ghost-hover)] text-[var(--text-primary)]"
                : "theme-muted hover:text-[var(--text-primary)]"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <FormInput
            id="username"
            label="Username"
            placeholder="your_username"
            autoComplete="username"
            disabled={isBusy}
            registration={register("username", {
              required: "Username is required.",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters.",
              },
              maxLength: {
                value: 32,
                message: "Username must be at most 32 characters.",
              },
            })}
            error={errors.username?.message}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            disabled={isBusy}
            registration={register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
              maxLength: {
                value: 128,
                message: "Password must be at most 128 characters.",
              },
            })}
            error={errors.password?.message}
          />

          {mode === "signup" && (
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isBusy}
              registration={register("confirmPassword", {
                validate: (value) =>
                  mode !== "signup" ||
                  value === watch("password") ||
                  "Passwords do not match.",
              })}
              error={errors.confirmPassword?.message}
            />
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between text-sm px-1">
            <div className="theme-muted">
              {mode === "signup"
                ? "Password must be at least 8 characters."
                : "Use your username to sign in."}
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBusy
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm theme-muted">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((current) => (current === "signup" ? "signin" : "signup"))
            }
            disabled={!isReady}
            className="font-semibold text-[var(--text-primary)] hover:text-purple-500 transition-colors"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
