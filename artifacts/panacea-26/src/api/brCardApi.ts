import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://panacea-gmck-backend-srvn.onrender.com";

const TOKEN_KEY = "panacea_access_token";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// =========================================================
// AUTH INTERCEPTOR
// =========================================================
//
// Every BR Card request automatically gets:
// Authorization: Bearer <access-token>
// =========================================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================================================
// TYPES
// =========================================================

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

export interface BrCardResponse {
    id: number;

    cardId: string | null;

    passType: BrCardPassType;

    amount: number;

    status: BrCardStatus;

    qrToken: string | null;

    transactionId: string | null;

    rejectionReason: string | null;

    createdAt?: string;

    updatedAt?: string;

    /**
     * true when an accommodation upgrade
     * payment of ₹500 is waiting for verification.
     */
    upgradePending: boolean;
}

export interface BrCardPaymentResponse {
    id: number;

    brCardId: number;

    transactionId: string;

    amount: number;

    status: BrCardPaymentStatus;

    rejectionReason: string | null;

    submittedAt: string;

    verifiedAt: string | null;
}

export interface AdminBrCardResponse {
    paymentId: number;

    brCardId: number;

    userId: number;

    cardId: string | null;

    passType: BrCardPassType;

    cardAmount: number;

    paymentAmount: number;

    isUpgrade: boolean;

    transactionId: string;

    paymentScreenshotUrl: string | null;

    status: BrCardPaymentStatus;

    rejectionReason: string | null;

    submittedAt: string;

    verifiedAt: string | null;
}

// =========================================================
// ERROR HANDLER
// =========================================================

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.error) {
            return data.error;
        }

        if (error.response?.status === 401) {
            return "Please login again.";
        }

        if (error.response?.status === 403) {
            return "You are not authorized to perform this action.";
        }

        if (error.response?.status === 404) {
            return "BR Card resource was not found.";
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong.";
}

// =========================================================
// API
// =========================================================

export const brCardApi = {

    // =====================================================
    // USER APIs
    // =====================================================

    /**
     * =====================================================
     * GET MY BR CARD
     * =====================================================
     *
     * Backend:
     *
     * GET /api/br-cards/me
     */
    async getMyBrCard(): Promise<BrCardResponse | null> {
        try {
            const response =
                await api.get<BrCardResponse | null>(
                    "/api/br-cards/me"
                );

            return response.data;
        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * SUBMIT NORMAL BR CARD PAYMENT
     * =====================================================
     *
     * Backend:
     *
     * POST /api/br-cards/payment
     *
     * Multipart fields:
     *
     * passType
     * transactionId
     * paymentScreenshot
     *
     * Used for:
     *
     * ₹1000 WITHOUT_ACCOMMODATION
     * ₹1500 WITH_ACCOMMODATION
     */
    async submitPayment(
        passType: BrCardPassType,
        transactionId: string,
        screenshot: File | null
    ): Promise<BrCardPaymentResponse> {
        try {
            const formData = new FormData();

            formData.append(
                "passType",
                passType
            );

            formData.append(
                "transactionId",
                transactionId.trim()
            );

            if (screenshot) {
                formData.append(
                    "paymentScreenshot",
                    screenshot
                );
            }

            const response =
                await api.post<BrCardPaymentResponse>(
                    "/api/br-cards/payment",
                    formData
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * SUBMIT ACCOMMODATION UPGRADE
     * =====================================================
     *
     * Backend:
     *
     * POST /api/br-cards/me/upgrade
     *
     * Multipart fields:
     *
     * transactionId
     * paymentScreenshot
     *
     * The backend returns:
     *
     * ResponseEntity<Void>
     *
     * Therefore this method returns Promise<void>.
     *
     * User pays ₹500.
     */
    async submitUpgradePayment(
        transactionId: string,
        screenshot: File | null
    ): Promise<void> {
        try {
            const formData = new FormData();

            formData.append(
                "transactionId",
                transactionId.trim()
            );

            if (screenshot) {
                formData.append(
                    "paymentScreenshot",
                    screenshot
                );
            }

            await api.post(
                "/api/br-cards/me/upgrade",
                formData
            );

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    // =====================================================
    // ADMIN APIs
    // =====================================================

    /**
     * =====================================================
     * GET PENDING PAYMENTS
     * =====================================================
     *
     * Backend:
     *
     * GET /api/br-cards/admin/pending
     *
     * ADMIN ONLY
     */
    async getPendingPayments(): Promise<
        AdminBrCardResponse[]
    > {
        try {
            const response =
                await api.get<AdminBrCardResponse[]>(
                    "/api/br-cards/admin/pending"
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * APPROVE PAYMENT
     * =====================================================
     *
     * Backend:
     *
     * POST /api/br-cards/admin/payments/{paymentId}/approve
     *
     * ADMIN ONLY
     */
    async approvePayment(
        paymentId: number
    ): Promise<BrCardResponse> {
        try {
            const response =
                await api.post<BrCardResponse>(
                    `/api/br-cards/admin/payments/${paymentId}/approve`
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * REJECT PAYMENT
     * =====================================================
     *
     * Backend:
     *
     * POST /api/br-cards/admin/payments/{paymentId}/reject
     *
     * Body:
     *
     * {
     *     reason: "..."
     * }
     *
     * ADMIN ONLY
     */
    async rejectPayment(
        paymentId: number,
        reason: string
    ): Promise<BrCardResponse> {
        try {
            const response =
                await api.post<BrCardResponse>(
                    `/api/br-cards/admin/payments/${paymentId}/reject`,
                    {
                        reason: reason.trim(),
                    }
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * VERIFY QR
     * =====================================================
     *
     * Backend:
     *
     * POST /api/br-cards/verify
     *
     * Body:
     *
     * {
     *     qrToken: "..."
     * }
     *
     * ADMIN ONLY
     */
    async verifyQr(
        qrToken: string
    ): Promise<BrCardResponse> {
        try {
            const response =
                await api.post<BrCardResponse>(
                    "/api/br-cards/verify",
                    {
                        qrToken: qrToken.trim(),
                    }
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },

    /**
     * =====================================================
     * GET ACTIVE BR CARDS
     * =====================================================
     *
     * Backend:
     *
     * GET /api/br-cards/admin/active
     *
     * ADMIN ONLY
     */
    async getActiveBrCards(): Promise<
        AdminBrCardResponse[]
    > {
        try {
            const response =
                await api.get<AdminBrCardResponse[]>(
                    "/api/br-cards/admin/active"
                );

            return response.data;

        } catch (error) {
            throw new Error(
                getErrorMessage(error)
            );
        }
    },
};
