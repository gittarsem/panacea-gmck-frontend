const API_BASE_URL = "https://panacea-gmck-backend-srvn.onrender.com/api";

/* =========================================================
   TYPES
   ========================================================= */

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

/* =========================================================
   UPDATE PROFILE
   ========================================================= */

export interface UpdateProfileRequest {
  fullName: string;
  collegeName: string;
  city: string;
  state: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/* =========================================================
   API ERROR
   ========================================================= */

export interface ApiError extends Error {
  status?: number;
  fieldErrors?: Record<string, string>;
}

/* =========================================================
   GENERIC REQUEST
   ========================================================= */

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data: unknown = null;

  const text = await response.text();

  if (text.trim()) {
    if (
      contentType?.includes(
        "application/json"
      )
    ) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Invalid JSON response from server"
        );
      }
    } else {
      data = text;
    }
  }

  if (!response.ok) {
    let message =
      "Something went wrong.";

    let fieldErrors:
      | Record<string, string>
      | undefined;

    if (
      typeof data === "string" &&
      data.trim()
    ) {
      message = data;
    }

    if (
      data &&
      typeof data === "object"
    ) {
      const errorData =
        data as {
          message?: string;
          error?: string;
          errors?:
            | string[]
            | string;
          fieldErrors?: Record<
            string,
            string
          >;
        };

      if (errorData.message) {
        message = errorData.message;
      } else if (errorData.error) {
        message = errorData.error;
      } else if (errorData.errors) {
        message =
          Array.isArray(
            errorData.errors
          )
            ? errorData.errors.join(
                ", "
              )
            : errorData.errors;
      }

      fieldErrors =
        errorData.fieldErrors;
    }

    const error =
      new Error(message) as ApiError;

    error.status =
      response.status;

    error.fieldErrors =
      fieldErrors;

    throw error;
  }

  return data as T;
}

/* =========================================================
   AUTH API
   ========================================================= */

/**
 * Register user
 */
async function signup(
  data: SignupRequest
): Promise<User> {
  return request<User>(
    "/auth/signup",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Login
 */
async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  return request<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Get currently authenticated user
 *
 * BACKEND:
 * GET /api/auth/me
 */
async function me(
  accessToken: string
): Promise<User> {
  return request<User>(
    "/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * Refresh access token
 */
async function refresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>(
    "/auth/refresh",
    {
      method: "POST",
    }
  );
}

/**
 * Logout
 */
async function logout(): Promise<void> {
  await request<void>(
    "/auth/logout",
    {
      method: "POST",
    }
  );
}

/* =========================================================
   PROFILE API
   ========================================================= */

/**
 * Update profile.
 *
 * IMPORTANT:
 * Change "/profile/me" here if your Spring
 * controller uses a different PUT mapping.
 */
async function updateProfile(
  accessToken: string,
  data: UpdateProfileRequest
): Promise<User> {
  return request<User>(
    "/profile/me",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
}

/**
 * Change password.
 *
 * IMPORTANT:
 * Change "/profile/me/password" here if your
 * Spring controller uses another mapping.
 */
async function changePassword(
  accessToken: string,
  data: ChangePasswordRequest
): Promise<void> {
  await request<void>(
    "/profile/me/password",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
}

/* =========================================================
   EXPORT
   ========================================================= */

export const authApi = {
  signup,
  login,
  me,
  refresh,
  logout,
  updateProfile,
  changePassword,
};
