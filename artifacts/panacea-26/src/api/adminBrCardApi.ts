const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://panacea-gmck-backend.onrender.com";

const TOKEN_KEY = "panacea_access_token";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      text || `Request failed: ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface AdminDashboard {
  totalBrCards: number;
  pendingPayments: number;
  activeBrCards: number;
  rejectedPayments: number;
  totalEvents: number;
  activeEvents: number;
  totalScheduleItems: number;
  activeScheduleItems: number;
}

export interface PendingPayment {
  id: number;
  brCardId: number;
  userId: number;
  transactionId: string;
  amount: number;
  paymentScreenshotUrl: string | null;
  status: string;
  rejectionReason: string | null;
  submittedAt: string;
  verifiedAt: string | null;
  passType: string;
  accommodation: boolean;
  cardId: string | null;
}

export interface VerifyCardResponse {
  id: number;
  userId: number;
  cardId: string;
  passType: string;
  amount: number;
  status: string;
  qrToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEvent {
  id: number;
  name: string;
  description: string | null;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  coordinator: string | null;
  contactNumber: string | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  name: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  coordinator: string;
  contactNumber: string;
  active: boolean;
  featured: boolean;
}

export interface ScheduleItem {
  id: number;
  title: string;
  description: string | null;
  scheduleDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  category: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRequest {
  title: string;
  description: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  category: string;
  active: boolean;
}

export interface FestivalSettings {
  id: number;
  festivalName: string;
  tagline: string | null;
  description: string | null;
  mainVenue: string | null;
  sportsVenue: string | null;
  academicVenue: string | null;
  instagram: string | null;
  primaryContact: string | null;
  secondaryContact: string | null;
  registrationOpen: boolean;
  festivalActive: boolean;
  updatedAt: string;
}

export interface FestivalSettingsRequest {
  festivalName: string;
  tagline: string;
  description: string;
  mainVenue: string;
  sportsVenue: string;
  academicVenue: string;
  instagram: string;
  primaryContact: string;
  secondaryContact: string;
  registrationOpen: boolean;
  festivalActive: boolean;
}

export const adminBrCardApi = {
  getDashboard() {
    return request<AdminDashboard>(
      "/api/admin/dashboard"
    );
  },

  getPendingPayments() {
    return request<PendingPayment[]>(
      "/api/br-cards/admin/pending"
    );
  },

  approvePayment(paymentId: number) {
    return request<unknown>(
      `/api/br-cards/admin/payments/${paymentId}/approve`,
      {
        method: "POST",
      }
    );
  },

  rejectPayment(
    paymentId: number,
    rejectionReason: string
  ) {
    return request<unknown>(
      `/api/br-cards/admin/payments/${paymentId}/reject`,
      {
        method: "POST",
        body: JSON.stringify({
          rejectionReason,
        }),
      }
    );
  },

  verifyCard(qrToken: string) {
    return request<VerifyCardResponse>(
      "/api/br-cards/verify",
      {
        method: "POST",
        body: JSON.stringify({
          qrToken,
        }),
      }
    );
  },

  getEvents() {
    return request<AdminEvent[]>(
      "/api/admin/events"
    );
  },

  getEvent(id: number) {
    return request<AdminEvent>(
      `/api/admin/events/${id}`
    );
  },

  createEvent(data: EventRequest) {
    return request<AdminEvent>(
      "/api/admin/events",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateEvent(
    id: number,
    data: EventRequest
  ) {
    return request<AdminEvent>(
      `/api/admin/events/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteEvent(id: number) {
    return request<void>(
      `/api/admin/events/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  getSchedule() {
    return request<ScheduleItem[]>(
      "/api/admin/schedule"
    );
  },

  getScheduleItem(id: number) {
    return request<ScheduleItem>(
      `/api/admin/schedule/${id}`
    );
  },

  createScheduleItem(
    data: ScheduleRequest
  ) {
    return request<ScheduleItem>(
      "/api/admin/schedule",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateScheduleItem(
    id: number,
    data: ScheduleRequest
  ) {
    return request<ScheduleItem>(
      `/api/admin/schedule/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteScheduleItem(id: number) {
    return request<void>(
      `/api/admin/schedule/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  getSettings() {
    return request<FestivalSettings>(
      "/api/admin/settings"
    );
  },

  updateSettings(
    data: FestivalSettingsRequest
  ) {
    return request<FestivalSettings>(
      "/api/admin/settings",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },
};