export interface User {
  id: string;
  username: string;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface TokenResponse {
  accessToken: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
}
