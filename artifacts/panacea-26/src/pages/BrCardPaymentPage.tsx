import {
  ArrowLeft,
  ArrowRight,
  Upload,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import PageTitle from "@/components/PageTitle";

/*
 * =========================================================
 * PANACEA PAYMENT CONFIG
 * =========================================================
 *
 * Replace this UPI ID with the official PANACEA UPI ID
 * before production.
 */
const PANACEA_UPI_ID = "tarsemgulab2006@okhdfcbank";
const PANACEA_UPI_NAME = "PANACEA 2026";

const API_BASE_URL = "http://localhost:8080/api";

/*
 * =========================================================
 * API ERROR HELPER
 * =========================================================
 */
async function getApiError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");

  try {
    if (contentType?.includes("application/json")) {
      const data = await response.json();

      if (typeof data === "string") {
        return data;
      }

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
      }

      if (data?.errors) {
        return Array.isArray(data.errors)
          ? data.errors.join(", ")
          : String(data.errors);
      }
    } else {
      const text = await response.text();

      if (text.trim()) {
        return text;
      }
    }
  } catch {
    // Ignore parsing errors and use fallback message.
  }

  return `Payment submission failed (${response.status})`;
}

export default function BrCardPaymentPage() {
  const { user } = useAuth();
  const [, setLoc] = useLocation();

  const [transactionId, setTransactionId] =
    useState("");

  const [screenshot, setScreenshot] =
    useState<File | null>(null);

  const [paymentConfirmed, setPaymentConfirmed] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const params = new URLSearchParams(
    window.location.search
  );

  const type =
    params.get("type") === "with_accommodation"
      ? "with_accommodation"
      : "without_accommodation";

  const price =
    type === "with_accommodation" ? 1500 : 1000;

  /*
   * =========================================================
   * UPI PAYMENT URL
   * =========================================================
   *
   * Without accommodation → ₹1,000
   * With accommodation    → ₹1,500
   */
  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(
      PANACEA_UPI_ID
    )}` +
    `&pn=${encodeURIComponent(
      PANACEA_UPI_NAME
    )}` +
    `&am=${price.toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(
      "PANACEA 2026 BR Card"
    )}`;

  /*
   * =========================================================
   * LOGIN CHECK
   * =========================================================
   */
  if (!user) {
    return (
      <main className="shell">
        <PageTitle
          tag="BR Card"
          title="LOGIN REQUIRED."
          sub="Please login to continue."
        />

        <button
          className="button"
          onClick={() => setLoc("/login")}
        >
          LOGIN
          <ArrowRight size={15} />
        </button>
      </main>
    );
  }

  /*
   * =========================================================
   * SUBMIT PAYMENT
   * =========================================================
   *
   * Flow:
   *
   * Frontend
   *   ↓
   * Multipart request
   *   ↓
   * Spring Boot
   *   ↓
   * Cloudinary uploads screenshot
   *   ↓
   * PostgreSQL stores payment
   *   ↓
   * PAYMENT_PENDING
   *   ↓
   * Status page
   */
  const handleSubmit = async () => {
    setError("");

    /*
     * -------------------------------------------------------
     * Validate transaction ID
     * -------------------------------------------------------
     */
    if (!transactionId.trim()) {
      setError(
        "Please enter your UPI transaction ID."
      );
      return;
    }

    /*
     * Basic frontend sanity check.
     *
     * Backend performs the actual validation as well.
     */
    const normalizedTransactionId =
      transactionId
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();

    if (
      normalizedTransactionId.length < 8 ||
      normalizedTransactionId.length > 40
    ) {
      setError(
        "Please enter a valid UPI transaction / UTR ID."
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * Validate screenshot
     * -------------------------------------------------------
     */
    if (!screenshot) {
      setError(
        "Please upload your payment screenshot."
      );
      return;
    }

    if (screenshot.size > 5 * 1024 * 1024) {
      setError(
        "Payment screenshot must be smaller than 5MB."
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(screenshot.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * Payment confirmation
     * -------------------------------------------------------
     */
    if (!paymentConfirmed) {
      setError(
        "Please confirm that you have completed the payment."
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * Access token
     * -------------------------------------------------------
     *
     * AuthContext stores the access token using this key.
     */
    const accessToken = localStorage.getItem(
      "panacea_access_token"
    );

    if (!accessToken) {
      setError(
        "Your login session has expired. Please login again."
      );

      setLoc("/login");
      return;
    }

    try {
      setSubmitting(true);

      /*
       * -----------------------------------------------------
       * IMPORTANT:
       *
       * Backend enum is:
       *
       * WITHOUT_ACCOMMODATION
       * WITH_ACCOMMODATION
       *
       * Therefore we must send the enum value expected
       * by Spring Boot, not the frontend URL value.
       * -----------------------------------------------------
       */
      const passType =
        type === "with_accommodation"
          ? "WITH_ACCOMMODATION"
          : "WITHOUT_ACCOMMODATION";

      /*
       * -----------------------------------------------------
       * Create multipart/form-data
       * -----------------------------------------------------
       *
       * DO NOT manually set Content-Type.
       *
       * Browser automatically adds:
       *
       * multipart/form-data;
       * boundary=...
       *
       */
      const formData = new FormData();

      formData.append(
        "passType",
        passType
      );

      formData.append(
        "transactionId",
        normalizedTransactionId
      );

      formData.append(
        "paymentScreenshot",
        screenshot
      );

      /*
       * -----------------------------------------------------
       * Submit to backend
       * -----------------------------------------------------
       *
       * Backend:
       *
       * POST /api/br-cards/payment
       *
       * Cloudinary receives the screenshot server-side.
       */
      const response = await fetch(
        `${API_BASE_URL}/br-cards/payment`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${accessToken}`,
          },

          credentials: "include",

          body: formData,
        }
      );

      /*
       * -----------------------------------------------------
       * Handle backend errors
       * -----------------------------------------------------
       */
      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "panacea_access_token"
          );

          setError(
            "Your login session has expired. Please login again."
          );

          setLoc("/login");
          return;
        }

        const message =
          await getApiError(response);

        throw new Error(message);
      }

      /*
       * -----------------------------------------------------
       * Payment successfully submitted
       * -----------------------------------------------------
       *
       * Backend response should be something like:
       *
       * {
       *   paymentId: 1,
       *   brCardId: 12,
       *   transactionId: "...",
       *   amount: 1000,
       *   status: "PENDING",
       *   ...
       * }
       *
       * We don't need to store it here because the status
       * page will fetch the latest BR Card state from backend.
       */
      await response.json();

      /*
       * Payment is now PAYMENT_PENDING.
       */
      setLoc("/br-card/status");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell">
      {/* BACK */}
      <button
        type="button"
        onClick={() =>
          setLoc(
            `/br-card/checkout?type=${type}`
          )
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: 30,
          padding: 0,
        }}
      >
        <ArrowLeft size={15} />

        <span className="mono">
          BACK TO DETAILS
        </span>
      </button>

      <PageTitle
        tag="Secure Payment"
        title="PAY."
        sub="Complete your payment using the official PANACEA UPI account."
      />

      <div
        className="two-col"
        style={{
          paddingBottom: 90,
        }}
      >
        {/* =====================================================
            LEFT — PAYMENT
        ===================================================== */}
        <section>
          <div
            className="mono"
            style={{
              marginBottom: 18,
            }}
          >
            STEP 01 · MAKE PAYMENT
          </div>

          {/* QR CARD */}
          <div
            style={{
              border: "1px solid var(--ink)",
              padding: 28,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              OFFICIAL PANACEA UPI
            </div>

            {/* QR CODE */}
            <div
              style={{
                width: 260,
                height: 260,
                margin: "0 auto",
                border:
                  "1px solid var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                padding: 12,
                boxSizing: "border-box",
              }}
            >
              <QRCodeSVG
                value={upiUrl}
                size={230}
                level="M"
                includeMargin
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            {/* AMOUNT */}
            <div
              style={{
                textAlign: "center",
                marginTop: 22,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 9,
                }}
              >
                AMOUNT
              </div>

              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </div>
            </div>

            {/* PASS TYPE */}
            <div
              style={{
                marginTop: 18,
                textAlign: "center",
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 9,
                }}
              >
                SELECTED PASS
              </span>

              <div
                style={{
                  marginTop: 5,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {type ===
                "with_accommodation"
                  ? "BR CARD + ACCOMMODATION"
                  : "BR CARD WITHOUT ACCOMMODATION"}
              </div>
            </div>

            {/* UPI ID */}
            <div
              style={{
                marginTop: 20,
                paddingTop: 18,
                borderTop:
                  "1px solid var(--ink)",
                textAlign: "center",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  marginBottom: 7,
                }}
              >
                UPI ID
              </div>

              <strong
                style={{
                  fontSize: 15,
                  wordBreak: "break-all",
                }}
              >
                {PANACEA_UPI_ID}
              </strong>
            </div>
          </div>

          {/* =================================================
              PAYMENT FLOW
          ================================================= */}
          <div
            style={{
              marginTop: 32,
              borderTop:
                "1px solid var(--ink)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                padding: "16px 0",
                borderBottom:
                  "1px solid var(--ink)",
              }}
            >
              HOW TO COMPLETE PAYMENT
            </div>

            <div
              style={{
                position: "relative",
                padding:
                  "26px 0 8px 42px",
              }}
            >
              {/* VERTICAL LINE */}
              <div
                style={{
                  position: "absolute",
                  left: 9,
                  top: 31,
                  bottom: 31,
                  width: 1,
                  background:
                    "var(--ink)",
                }}
              />

              <PaymentStep
                number="01"
                title="SCAN"
                text="Scan the official PANACEA payment QR using your UPI app."
              />

              <PaymentStep
                number="02"
                title="PAY"
                text={`Pay exactly ₹${price.toLocaleString(
                  "en-IN"
                )}. The amount is pre-filled in the payment request.`}
              />

              <PaymentStep
                number="03"
                title="SAVE"
                text="Complete the payment and save your successful payment screenshot."
              />

              <PaymentStep
                number="04"
                title="SUBMIT"
                text="Enter the transaction / UTR ID and upload your payment screenshot."
                last
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT — SUBMISSION
        ===================================================== */}
        <section>
          <div
            className="mono"
            style={{
              marginBottom: 18,
            }}
          >
            STEP 02 · SUBMIT PAYMENT
          </div>

          {/* AMOUNT */}
          <div
            style={{
              borderTop:
                "1px solid var(--ink)",
              borderBottom:
                "1px solid var(--ink)",
              padding: "20px 0",
              marginBottom: 28,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
              }}
            >
              AMOUNT TO PAY
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              ₹
              {price.toLocaleString(
                "en-IN"
              )}
            </div>
          </div>

          {/* TRANSACTION ID */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <label
              className="mono"
              style={{
                display: "block",
                fontSize: 11,
                marginBottom: 10,
              }}
            >
              UPI TRANSACTION / UTR ID *
            </label>

            <input
              type="text"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(
                  e.target.value
                );
                setError("");
              }}
              placeholder="Enter transaction / UTR ID"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "15px 14px",
                border:
                  "1px solid var(--ink)",
                background:
                  "transparent",
                fontFamily: "inherit",
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>

          {/* SCREENSHOT */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <label
              className="mono"
              style={{
                display: "block",
                fontSize: 11,
                marginBottom: 10,
              }}
            >
              PAYMENT SCREENSHOT *
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 18,
                border:
                  "1px dashed var(--ink)",
                cursor: "pointer",
              }}
            >
              <Upload size={18} />

              <span
                style={{
                  fontSize: 14,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow:
                    "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {screenshot
                  ? screenshot.name
                  : "Upload payment screenshot"}
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0] ||
                    null;

                  setScreenshot(file);
                  setError("");
                }}
                style={{
                  display: "none",
                }}
              />
            </label>

            <p
              className="mono"
              style={{
                fontSize: 9,
                marginTop: 8,
              }}
            >
              PNG, JPG OR WEBP · MAX 5MB
            </p>
          </div>

          {/* PAYMENT CONFIRMATION */}
          <label
            style={{
              display: "flex",
              alignItems:
                "flex-start",
              gap: 10,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            <input
              type="checkbox"
              checked={paymentConfirmed}
              onChange={(e) =>
                setPaymentConfirmed(
                  e.target.checked
                )
              }
              style={{
                width: 17,
                height: 17,
                marginTop: 3,
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              I confirm that I have
              completed the payment of{" "}
              <strong>
                ₹
                {price.toLocaleString(
                  "en-IN"
                )}
              </strong>{" "}
              to the official PANACEA
              UPI account and that the
              transaction details provided
              above are correct.
            </span>
          </label>

          {/* ERROR */}
          {error && (
            <div
              style={{
                border:
                  "1px solid var(--ink)",
                padding: 14,
                marginBottom: 20,
                fontSize: 14,
                lineHeight: 1.5,
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            className="button"
            disabled={submitting}
            onClick={handleSubmit}
            style={{
              opacity: submitting
                ? 0.5
                : 1,
              cursor: submitting
                ? "not-allowed"
                : "pointer",
            }}
          >
            {submitting
              ? "SUBMITTING..."
              : "SUBMIT PAYMENT"}

            {!submitting && (
              <ArrowRight size={15} />
            )}
          </button>

          <p
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              marginTop: 16,
            }}
          >
            Your payment will remain{" "}
            <strong>PENDING</strong> until
            it is manually verified by the
            PANACEA organising team.
          </p>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
 * PAYMENT FLOW STEP
 * ========================================================= */

function PaymentStep({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: last
          ? 12
          : 32,
      }}
    >
      {/* DOT */}
      <div
        style={{
          position: "absolute",
          left: -42,
          top: 1,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--ink)",
          border:
            "4px solid var(--cream)",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      />

      <div
        className="mono"
        style={{
          fontSize: 9,
          marginBottom: 5,
          opacity: 0.65,
        }}
      >
        STEP {number}
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 5,
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          maxWidth: 500,
        }}
      >
        {text}
      </p>
    </div>
  );
}