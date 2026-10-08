const API_BASE_URL = "http://localhost:8080/api";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  city: string;
  state: string;
  roles: string[];
}

export interface SignupRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  city: string;
  state: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type");

  let data: unknown = null;

  /*
   * Read the response safely.
   *
   * Important:
   * /auth/logout returns an empty body.
   */
  const text = await response.text();

  if (text.trim()) {
    if (contentType?.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from server");
      }
    } else {
      data = text;
    }
  }

  if (!response.ok) {
    let message = "Something went wrong";

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      const errorData = data as {
        message?: string;
        error?: string;
        errors?: string[] | string;
      };

      if (errorData.message) {
        message = errorData.message;
      } else if (errorData.error) {
        message = errorData.error;
      } else if (errorData.errors) {
        message = Array.isArray(errorData.errors)
          ? errorData.errors.join(", ")
          : errorData.errors;
      }
    }

    throw new Error(message);
  }

  return data as T;
}

/* =========================
   AUTH API FUNCTIONS
   ========================= */

async function signup(data: SignupRequest): Promise<User> {
  return request<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function login(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function me(accessToken: string): Promise<User> {
  return request<User>("/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function refresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>("/auth/refresh", {
    method: "POST",
  });
}

async function logout(): Promise<void> {
  await request<void>("/auth/logout", {
    method: "POST",
  });
}

/*
 * THIS IS THE IMPORTANT PART
 *
 * AuthContext.tsx imports:
 *
 * import { authApi } from "@/api/authApi";
 */
export const authApi = {
  signup,
  login,
  me,
  refresh,
  logout,
};