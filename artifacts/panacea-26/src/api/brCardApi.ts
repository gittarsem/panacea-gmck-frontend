const API_BASE_URL = "http://localhost:8080/api";

export type BrCardPassType =
  | "WITHOUT_ACCOMMODATION"
  | "WITH_ACCOMMODATION";

export type BrCardStatus =
  | "PAYMENT_PENDING"
  | "ACTIVE"
  | "REJECTED";

export type BrCardPaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface BrCardPaymentResponse {
  paymentId: number;
  brCardId: number;
  transactionId: string;
  amount: number;
  status: BrCardPaymentStatus;
  rejectionReason: string | null;
  submittedAt: string;
  verifiedAt: string | null;
}

export interface BrCardResponse {
  id: number;
  cardId: string | null;
  passType: BrCardPassType;
  amount: number;
  status: BrCardStatus;
  qrToken: string | null;
  transactionId: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

function getAccessToken(): string | null {
  return localStorage.getItem("panacea_access_token");
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

async function getMyBrCard(): Promise<BrCardResponse | null> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Please login to view your BR Card.");
  }

  const response = await fetch(`${API_BASE_URL}/br-cards/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await parseResponse(response);

  // No BR Card purchased yet.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let message = "Unable to load BR Card.";

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      const errorData = data as {
        message?: string;
        error?: string;
      };

      message =
        errorData.message ||
        errorData.error ||
        message;
    }

    throw new Error(message);
  }

  return data as BrCardResponse;
}

async function submitPayment(
  passType: BrCardPassType,
  transactionId: string,
  paymentScreenshot: File
): Promise<BrCardPaymentResponse> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Please login before submitting payment.");
  }

  const formData = new FormData();

  formData.append("passType", passType);
  formData.append("transactionId", transactionId);
  formData.append("paymentScreenshot", paymentScreenshot);

  const response = await fetch(
    `${API_BASE_URL}/br-cards/payment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: formData,
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    let message = "Payment submission failed.";

    if (typeof data === "string" && data.trim()) {
      message = data;
    } else if (data && typeof data === "object") {
      const errorData = data as {
        message?: string;
        error?: string;
      };

      message =
        errorData.message ||
        errorData.error ||
        message;
    }

    throw new Error(message);
  }

  return data as BrCardPaymentResponse;
}

export const brCardApi = {
  getMyBrCard,
  submitPayment,
};