export type ApiErrorResponse = {
    timestamp?: string;
    status?: number;
    error?: string;
    message?: string;
    path?: string;
    fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
    status?: number;
    code?: string;
    fieldErrors?: Record<string, string>;

    constructor(
        message: string,
        options?: {
            status?: number;
            code?: string;
            fieldErrors?: Record<string, string>;
        }
    ) {
        super(message);

        this.name = "ApiError";

        this.status = options?.status;
        this.code = options?.code;
        this.fieldErrors =
            options?.fieldErrors;
    }
}


/* =========================================================
   API RESPONSE PARSER
   ========================================================= */

export async function parseApiResponse<T>(
    response: Response
): Promise<T> {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";

    let data:
        | ApiErrorResponse
        | T
        | null = null;

    if (
        contentType.includes(
            "application/json"
        )
    ) {
        try {
            data = await response.json();
        } catch {
            data = null;
        }
    } else {
        try {
            const text =
                await response.text();

            data = text
                ? ({
                      message: text,
                  } as ApiErrorResponse)
                : null;
        } catch {
            data = null;
        }
    }

    if (!response.ok) {

        const errorData =
            data as ApiErrorResponse | null;

        throw new ApiError(
            errorData?.message ||
                getFallbackMessage(
                    response.status
                ),
            {
                status:
                    errorData?.status ||
                    response.status,

                code:
                    errorData?.error,

                fieldErrors:
                    errorData?.fieldErrors,
            }
        );
    }

    return data as T;
}


/* =========================================================
   FALLBACK MESSAGES
   ========================================================= */

function getFallbackMessage(
    status: number
): string {

    switch (status) {
        case 400:
            return "Please check your information.";

        case 401:
            return "Invalid email or password.";

        case 403:
            return "You do not have permission to perform this action.";

        case 404:
            return "The requested resource was not found.";

        case 409:
            return "This information already exists.";

        case 422:
            return "The submitted information is invalid.";

        case 429:
            return "Too many requests. Please try again later.";

        case 500:
            return "Something went wrong. Please try again later.";

        case 503:
            return "Service temporarily unavailable. Please try again later.";

        default:
            return "Something went wrong. Please try again.";
    }
}