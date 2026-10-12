export type SavedEvent = {
  id: number;
  eventId: string;
  name: string;
  category: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  savedAt: string;
};

export type SaveEventRequest = {
  eventId: string;
  name: string;
  category: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  description: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

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
      await response
        .json()
        .catch(() => null);

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

export const savedEventsApi = {

  /**
   * Get all saved events for logged-in user.
   */
  getAll: () =>
    request<SavedEvent[]>(
      "/api/saved-events"
    ),

  /**
   * Save an event.
   */
  save: (
    payload: SaveEventRequest
  ) =>
    request<SavedEvent>(
      "/api/saved-events",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),

  /**
   * Check whether event is saved.
   */
  exists: (
    eventId: string
  ) =>
    request<boolean>(
      `/api/saved-events/${encodeURIComponent(
        eventId
      )}/exists`
    ),

  /**
   * Remove saved event.
   */
  remove: (
    eventId: string
  ) =>
    request<void>(
      `/api/saved-events/${encodeURIComponent(
        eventId
      )}`,
      {
        method: "DELETE",
      }
    ),
};