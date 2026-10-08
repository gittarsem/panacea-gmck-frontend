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

  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "panacea_access_token";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [loading, setLoading] = useState(true);

  /**
   * Save access token
   */
  const saveToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAccessToken(token);
  };

  /**
   * Clear authentication state
   */
  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);

    setAccessToken(null);
    setUser(null);
  };

  /**
   * Load current user using access token
   */
  const loadUser = async (token: string) => {
    try {
      const currentUser = await authApi.me(token);

      setUser(currentUser);
    } catch {
      /*
       * Access token may be expired.
       *
       * Do not immediately clear authentication here.
       * refreshUser() can attempt a refresh.
       */
      throw new Error("Unable to load current user");
    }
  };

  /**
   * Initialize authentication when application starts
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await loadUser(token);
      } catch {
        /*
         * Access token may have expired.
         * Try using the HttpOnly refresh cookie.
         */
        try {
          const response = await authApi.refresh();

          saveToken(response.accessToken);

          const currentUser = await authApi.me(
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

  /**
   * Login
   */
  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);

    saveToken(response.accessToken);

    setUser(response.user);
  };

  /**
   * Signup
   *
   * Backend signup returns the created user.
   * Therefore we immediately login after signup
   * to obtain the JWT access token.
   */
  const signup = async (data: SignupRequest) => {
    await authApi.signup(data);

    const response = await authApi.login({
      email: data.email,
      password: data.password,
    });

    saveToken(response.accessToken);

    setUser(response.user);
  };

  /**
   * Refresh current user
   */
  const refreshUser = async () => {
    if (!accessToken) {
      return;
    }

    try {
      const currentUser = await authApi.me(accessToken);

      setUser(currentUser);
    } catch {
      /*
       * Access token expired.
       * Try refresh token cookie.
       */
      try {
        const response = await authApi.refresh();

        saveToken(response.accessToken);

        const currentUser = await authApi.me(
          response.accessToken
        );

        setUser(currentUser);
      } catch {
        clearAuth();
      }
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      /*
       * Always clear local authentication state.
       *
       * The backend clears the HttpOnly refresh cookie.
       */
      clearAuth();
    }
  };

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

/**
 * Authentication hook
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}