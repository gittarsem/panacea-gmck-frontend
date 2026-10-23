const API_BASE_URL = "https://panacea-gmck-backend-srvn.onrender.com/api";

export type AdminBrCardPassType =
    | "WITHOUT_ACCOMMODATION"
    | "WITH_ACCOMMODATION";

export type AdminBrCardPaymentStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export type AdminBrCardStatus =
    | "PAYMENT_PENDING"
    | "ACTIVE"
    | "REJECTED";

export interface AdminDashboardResponse {
    totalBrCards: number;
    pendingPayments: number;
    activeBrCards: number;
    rejectedPayments: number;
}

export interface BrCardVerifyResponse {
    id: number;
    cardId: string | null;
    passType: AdminBrCardPassType;
    amount: number;
    status: AdminBrCardStatus;
    qrToken: string | null;
    transactionId: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminBrCardPayment {
    paymentId: number;
    brCardId: number;
    userId: number;
    cardId: string | null;

    fullName: string;
    email: string;
    phoneNumber: string;
    collegeName: string;
    city: string;
    state: string;

    passType: AdminBrCardPassType;

    expectedAmount: number;
    paymentAmount: number;

    upgrade: boolean;

    transactionId: string;
    paymentScreenshotUrl: string;

    paymentStatus: AdminBrCardPaymentStatus;

    rejectionReason: string | null;

    submittedAt: string;
    verifiedAt: string | null;
}

export type AdminBrCardResponse = AdminBrCardPayment;

export interface AdminBrCard {
    id: number;
    cardId: string | null;
    userId: number;
    passType: AdminBrCardPassType;
    amount: number;
    status: AdminBrCardStatus;
    qrToken: string | null;
    transactionId: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    collegeName: string;
    city: string;
    state: string;
    roles: string[];
}

function getAccessToken(): string | null {
    return localStorage.getItem(
        "panacea_access_token"
    );
}

async function parseResponse(
    response: Response
): Promise<unknown> {
    const contentType =
        response.headers.get("content-type");

    const text = await response.text();

    if (!text.trim()) {
        return null;
    }

    if (
        contentType?.includes(
            "application/json"
        )
    ) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    return text;
}

function getErrorMessage(
    data: unknown,
    fallback: string
): string {
    if (
        typeof data === "string" &&
        data.trim()
    ) {
        return data;
    }

    if (
        data &&
        typeof data === "object"
    ) {
        const errorData = data as {
            message?: string;
            error?: string;
        };

        return (
            errorData.message ||
            errorData.error ||
            fallback
        );
    }

    return fallback;
}

async function adminFetch(
    path: string,
    options: RequestInit = {}
): Promise<unknown> {
    const token = getAccessToken();

    if (!token) {
        throw new Error(
            "Please login as an administrator."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
            credentials: "include",
        }
    );

    const data =
        await parseResponse(response);

    if (!response.ok) {
        throw new Error(
            getErrorMessage(
                data,
                "Admin request failed."
            )
        );
    }

    return data;
}

async function getDashboard(): Promise<AdminDashboardResponse> {
    const data = await adminFetch(
        "/admin/dashboard",
        {
            method: "GET",
        }
    );

    return data as AdminDashboardResponse;
}

async function getPendingPayments(): Promise<
    AdminBrCardPayment[]
> {
    const data = await adminFetch(
        "/br-cards/admin/pending",
        {
            method: "GET",
        }
    );

    return data as AdminBrCardPayment[];
}

async function getActiveBrCards(): Promise<
    AdminBrCardResponse[]
> {
    const data = await adminFetch(
        "/br-cards/admin/active",
        {
            method: "GET",
        }
    );

    return data as AdminBrCardResponse[];
}

async function approvePayment(
    paymentId: number
): Promise<unknown> {
    return adminFetch(
        `/br-cards/admin/payments/${paymentId}/approve`,
        {
            method: "POST",
        }
    );
}

async function rejectPayment(
    paymentId: number,
    reason: string
): Promise<unknown> {
    return adminFetch(
        `/br-cards/admin/payments/${paymentId}/reject`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                reason,
            }),
        }
    );
}

async function verifyQr(
    qrToken: string
): Promise<BrCardVerifyResponse> {
    const data = await adminFetch(
        "/br-cards/verify",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                qrToken,
            }),
        }
    );

    return data as BrCardVerifyResponse;
}

async function getSettings(): Promise<unknown> {
    return adminFetch(
        "/admin/settings",
        {
            method: "GET",
        }
    );
}

async function updateSettings(
    settings: Record<string, unknown>
): Promise<unknown> {
    return adminFetch(
        "/admin/settings",
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(settings),
        }
    );
}

/**
 * Unlock admin user management.
 *
 * The backend verifies the approval password
 * before returning any users.
 */
export async function accessAdminUsers(
    approvalPassword: string
): Promise<AdminUser[]> {
    const data = await adminFetch(
        "/admin/users/access",
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                approvalPassword,
            }),
        }
    );

    return data as AdminUser[];
}

/**
 * Promote an existing user to ROLE_ADMIN.
 *
 * The backend verifies the approval password
 * before changing the user's role.
 */
export async function approveAdmin(
    userId: number,
    approvalPassword: string
): Promise<AdminUser> {
    const data = await adminFetch(
        `/admin/users/${userId}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                approvalPassword,
            }),
        }
    );

    return data as AdminUser;
}

export function isUpgradePayment(
    payment: AdminBrCardPayment
): boolean {
    return (
        payment.upgrade === true ||
        (
            payment.paymentAmount === 500 &&
            payment.passType ===
                "WITH_ACCOMMODATION"
        )
    );
}

export function getPaymentLabel(
    payment: AdminBrCardPayment
): string {
    return isUpgradePayment(payment)
        ? "ACCOMMODATION UPGRADE"
        : "NEW BR CARD";
}

export function getPaymentAmountLabel(
    payment: AdminBrCardPayment
): string {
    if (isUpgradePayment(payment)) {
        return "₹500";
    }

    return `₹${payment.paymentAmount}`;
}

export const adminApi = {
    getDashboard,
    getPendingPayments,
    getActiveBrCards,
    approvePayment,
    rejectPayment,
    verifyQr,
    getSettings,
    updateSettings,
    accessAdminUsers,
    approveAdmin,
};
