import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  authApi,
  type LoginRequest,
  type SignupRequest,
  type User,
} from "@/api/authApi";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;

  login: (data: LoginRequest) => Promise<User>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

const TOKEN_KEY = "panacea_access_token";

/* =========================================================
   API ERROR
   ========================================================= */

export interface AuthApiError extends Error {
  status?: number;
  code?: string;
  fieldErrors?: Record<string, string>;
}

function createAuthError(
  error: unknown,
  fallbackMessage: string
): AuthApiError {
  if (error instanceof Error) {
    return error as AuthApiError;
  }

  const authError = new Error(
    fallbackMessage
  ) as AuthApiError;

  return authError;
}

/* =========================================================
   AUTH PROVIDER
   ========================================================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(() => {
      return localStorage.getItem(TOKEN_KEY);
    });

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     TOKEN HELPERS
     ======================================================= */

  const saveToken = (token: string) => {
    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    setAccessToken(token);
  };

  const clearAuth = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setAccessToken(null);
    setUser(null);
  };

  /* =======================================================
     LOAD CURRENT USER
     ======================================================= */

  const loadUser = async (
    token: string
  ) => {
    try {
      const currentUser =
        await authApi.me(token);

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      /*
       * Do not replace the original API error.
       *
       * This allows backend errors such as:
       *
       * {
       *   "status": 401,
       *   "message": "Invalid or expired token"
       * }
       *
       * to continue through the auth layer.
       */
      throw createAuthError(
        error,
        "Unable to load current user."
      );
    }
  };

  /* =======================================================
     INITIALIZE AUTH
     ======================================================= */

  useEffect(() => {
    const initializeAuth =
      async () => {
        const token =
          localStorage.getItem(
            TOKEN_KEY
          );

        if (!token) {
          setLoading(false);
          return;
        }

        try {
          await loadUser(token);
        } catch {
          /*
           * Access token may be expired.
           * Try refresh token before logging
           * the user out.
           */
          try {
            const response =
              await authApi.refresh();

            saveToken(
              response.accessToken
            );

            const currentUser =
              await authApi.me(
                response.accessToken
              );

            setUser(currentUser);
          } catch {
            clearAuth();
          }
        } finally {
          setLoading(false);
        }
      };

    initializeAuth();
  }, []);

  /* =======================================================
     LOGIN
     ======================================================= */

  const login = async (
    data: LoginRequest
  ): Promise<User> => {
    try {
      const response =
        await authApi.login(data);

      saveToken(
        response.accessToken
      );

      setUser(response.user);

      return response.user;
    } catch (error) {
      /*
       * IMPORTANT:
       * Preserve the error coming from authApi.
       *
       * AuthPage can now display:
       *
       * - Invalid credentials
       * - Account not found
       * - Account disabled
       * - Backend validation message
       * - Network error
       */
      throw createAuthError(
        error,
        "Login failed. Please try again."
      );
    }
  };

  /* =======================================================
     SIGNUP
     ======================================================= */

  const signup = async (
    data: SignupRequest
  ): Promise<void> => {
    try {
      /*
       * Create account first.
       */
      await authApi.signup(data);

      /*
       * Automatically login after
       * successful registration.
       */
      const response =
        await authApi.login({
          email: data.email,
          password: data.password,
        });

      saveToken(
        response.accessToken
      );

      setUser(response.user);
    } catch (error) {
      /*
       * Preserve backend validation errors.
       *
       * Example:
       *
       * fieldErrors: {
       *   email: "Email is already registered",
       *   phoneNumber: "Phone number is already registered"
       * }
       */
      throw createAuthError(
        error,
        "Registration failed. Please try again."
      );
    }
  };

  /* =======================================================
     REFRESH USER
     ======================================================= */

  const refreshUser = async () => {
    if (!accessToken) {
      return;
    }

    try {
      const currentUser =
        await authApi.me(
          accessToken
        );

      setUser(currentUser);
    } catch {
      /*
       * Current access token may be expired.
       * Try refreshing it.
       */
      try {
        const response =
          await authApi.refresh();

        saveToken(
          response.accessToken
        );

        const currentUser =
          await authApi.me(
            response.accessToken
          );

        setUser(currentUser);
      } catch {
        clearAuth();
      }
    }
  };

  /* =======================================================
     LOGOUT
     ======================================================= */

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      /*
       * Logout should still clear the local
       * authentication state even if the backend
       * request fails.
       */
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      clearAuth();
    }
  };

  /* =======================================================
     PROVIDER
     ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   USE AUTH
   ========================================================= */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}