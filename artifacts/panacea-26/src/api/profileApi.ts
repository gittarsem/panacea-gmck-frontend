export type ProfileResponse = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  city: string;
  state: string;
  roles?: string[];
};

export type UpdateProfileRequest = {
  fullName: string;
  collegeName: string;
  city: string;
  state: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://panacea-gmck-backend-srvn.onrender.com";

const TOKEN_KEY =
  "panacea_access_token";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    localStorage.getItem(TOKEN_KEY);

  const headers = new Headers(
    options.headers
  );

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    const data =
      await response.json().catch(
        () => null
      );

    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const profileApi = {
  /*
   * CONFIRMED BACKEND ENDPOINT
   *
   * GET /api/auth/me
   */
  getProfile: () =>
    request<ProfileResponse>(
      "/api/auth/me"
    ),

  /*
   * UPDATE PROFILE
   *
   * Backend endpoint must be:
   * PUT /api/profile/me
   */
  updateProfile: (
    payload: UpdateProfileRequest
  ) =>
    request<ProfileResponse>(
      "/api/profile/me",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    ),

  /*
   * CHANGE PASSWORD
   *
   * Backend endpoint must be:
   * PUT /api/profile/me/password
   */
  changePassword: (
    payload: ChangePasswordRequest
  ) =>
    request<void>(
      "/api/profile/me/password",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    ),
};
