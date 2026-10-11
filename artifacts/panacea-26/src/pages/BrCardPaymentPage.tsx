import {

  ArrowLeft,

  ArrowRight,

  Check,

  Upload,

} from "lucide-react";

import { useState } from "react";

import { useLocation } from "wouter";

import PageTitle from "@/components/PageTitle";

import { brCardApi } from "../api/brCardApi";

export default function BrCardPaymentPage() {

  const [, setLocation] =

    useLocation();

  const params = new URLSearchParams(

    window.location.search

  );

  const isUpgrade =

    params.get("upgrade") === "true";

  const type =

    params.get("type") ===

    "with_accommodation"

      ? "with_accommodation"

      : "without_accommodation";

  const price = isUpgrade

    ? 500

    : type === "with_accommodation"

      ? 1500

      : 1000;

  // Replace this with the PANACEA payment UPI ID.

  const upiId = "faizanmalik551@okicici";

  // Client-side upload limits. Keep these conservative for Cloudinary usage.

  const MAX_SCREENSHOT_SIZE = 10 * 1024 * 1024; // 10 MB

  const ALLOWED_IMAGE_TYPES = [

    "image/jpeg",

    "image/png",

    "image/webp",

  ];

  // Required transaction ID format: exactly 12 digits, starting with 1-9.

  const TRANSACTION_ID_PATTERN = /^[1-9]\d{11}$/;

  const upiPaymentUrl =

    `upi://pay?pa=${encodeURIComponent(upiId)}` +

    `&pn=${encodeURIComponent("PANACEA '26")}` +

    `&am=${price.toFixed(2)}` +

    `&cu=INR`;

  const qrCodeUrl =

    `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(upiPaymentUrl)}`;

  const passLabel = isUpgrade

    ? "BR CARD · ACCOMMODATION UPGRADE"

    : type === "with_accommodation"

      ? "BR CARD + ACCOMMODATION"

      : "BR CARD";

  const [transactionId, setTransactionId] =

    useState("");

  const [

    paymentScreenshot,

    setPaymentScreenshot,

  ] = useState<File | null>(null);

  const [submitting, setSubmitting] =

    useState(false);

  const [error, setError] =

    useState("");

  const [confirmed, setConfirmed] =

    useState(false);

  const submitPayment = async () => {

    setError("");

    const cleanTransactionId = transactionId.trim();

    if (!cleanTransactionId) {

      setError("Please enter your transaction ID.");

      return;

    }

    if (!TRANSACTION_ID_PATTERN.test(cleanTransactionId)) {

      setError(

        "Transaction ID must be exactly 12 digits and start with 4, 5 or 6."

      );

      return;

    }

    if (!paymentScreenshot) {

      setError("Please upload your payment screenshot.");

      return;

    }

    if (!ALLOWED_IMAGE_TYPES.includes(paymentScreenshot.type)) {

      setError("Only JPG, PNG or WEBP images are allowed.");

      return;

    }

    if (paymentScreenshot.size > MAX_SCREENSHOT_SIZE) {

      setError("Payment screenshot must be 10 MB or smaller.");

      return;

    }

    if (!confirmed) {

      setError(

        "Please confirm the payment details."

      );

      return;

    }

    try {

      setSubmitting(true);

      if (isUpgrade) {

        await brCardApi.submitUpgradePayment(

          cleanTransactionId,

          paymentScreenshot

        );

      } else {

        await brCardApi.submitPayment(

          type === "with_accommodation"

            ? "WITH_ACCOMMODATION"

            : "WITHOUT_ACCOMMODATION",

          cleanTransactionId,

          paymentScreenshot

        );

      }

      setLocation(

        "/br-card/status"

      );

    } catch (err) {

      setError(

        err instanceof Error

          ? err.message

          : "Payment submission failed."

      );

    } finally {

      setSubmitting(false);

    }

  };

  return (

    <main

      className="panacea-payment-page"

      style={{

        width: "100%",

        boxSizing: "border-box",

        minHeight: "70vh",

        padding:

          "40px 20px 80px",

      }}

    >

      <div

        className="payment-page-container"

        style={{

          maxWidth: 1100,

          margin: "0 auto",

        }}

      >

        <button

          onClick={() =>

            setLocation(

              "/br-card/status"

            )

          }

          style={{

            border: "none",

            background:

              "transparent",

            padding: 0,

            cursor: "pointer",

            display: "inline-flex",

            alignItems: "center",

            gap: 8,

            marginBottom: 35,

          }}

        >

          <ArrowLeft size={16} />

          BACK TO BR CARD

        </button>

        <PageTitle

          tag={`PANACEA ’26 / ${passLabel}`}

          title={

            isUpgrade

              ? "UPGRADE"

              : "PAYMENT"

          }

          sub={

            isUpgrade

              ? "Upgrade your existing BR Card to include accommodation."

              : "Complete your BR Card payment and submit the proof for verification."

          }

        />

        <div

          className="payment-layout"

          style={{

            display: "grid",

            gridTemplateColumns:

              "minmax(0, 0.9fr) minmax(0, 1.1fr)",

            gap: 30,

            alignItems:

              "start",

          }}

        >

          <section

            className="payment-details"

            style={{

              border:

                "1px solid rgba(0,0,0,0.15)",

              padding: 30,

            }}

          >

            <div

              className="mono"

              style={{

                fontSize: 10,

                marginBottom: 14,

              }}

            >

              PAYMENT SUMMARY

            </div>

            <div

              className="payment-pass-label"

              style={{

                fontSize: 28,

                fontWeight: 600,

              }}

            >

              {passLabel}

            </div>

            {isUpgrade && (

              <div

                style={{

                  marginTop: 20,

                  padding: 16,

                  border:

                    "1px solid rgba(0,0,0,0.12)",

                  fontSize: 14,

                  lineHeight: 1.6,

                }}

              >

                Your existing BR Card remains

                active while this ₹500 upgrade

                payment is being verified.

              </div>

            )}

            <div

              style={{

                marginTop: 35,

                paddingTop: 25,

                borderTop:

                  "1px solid rgba(0,0,0,0.12)",

              }}

            >

              <div

                className="mono"

                style={{

                  fontSize: 10,

                  marginBottom: 8,

                }}

              >

                AMOUNT TO PAY

              </div>

              <div

                className="payment-amount"

                style={{

                  fontSize: 48,

                  fontWeight: 700,

                  lineHeight: 1,

                }}

              >

                ₹{price}

              </div>

            </div>

            <div

              style={{

                marginTop: 35,

                padding: 22,

                border: "1px solid rgba(0,0,0,0.15)",

                background: "rgba(0,0,0,0.02)",

              }}

            >

              <div

                className="mono"

                style={{

                  fontSize: 10,

                  marginBottom: 16,

                }}

              >

                PAY VIA UPI

              </div>

              <div

                className="upi-payment-grid"

                style={{

                  display: "grid",

                  gridTemplateColumns:

                    "repeat(auto-fit, minmax(180px, 1fr))",

                  gap: 22,

                  alignItems: "center",

                }}

              >

                <div

                  className="upi-qr-box"

                  style={{

                    width: 180,

                    height: 180,

                    background: "#fff",

                    border:

                      "1px solid rgba(0,0,0,0.12)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    padding: 8,

                    boxSizing: "border-box",

                    margin: "0 auto",

                  }}

                >

                  <img

                    src={qrCodeUrl}

                    alt={`UPI payment QR code for ₹${price}`}

                    width={164}

                    height={164}

                    style={{

                      display: "block",

                      width: 164,

                      height: 164,

                    }}

                  />

                </div>

                <div className="upi-info">

                  <div

                    style={{

                      fontSize: 16,

                      fontWeight: 600,

                      lineHeight: 1.4,

                    }}

                  >

                    Scan this QR to pay ₹{price}

                  </div>

                  <div

                    className="mono"

                    style={{

                      marginTop: 10,

                      fontSize: 11,

                      wordBreak: "break-all",

                      opacity: 0.7,

                    }}

                  >

                    UPI ID: {upiId}

                  </div>

                  <div

                    style={{

                      marginTop: 14,

                      fontSize: 13,

                      lineHeight: 1.55,

                      opacity: 0.75,

                    }}

                  >

                    On desktop, scan the QR using Google Pay,

                    PhonePe, Paytm or another UPI app. The amount

                    and UPI ID are filled automatically.

                  </div>

                  <a

                    href={upiPaymentUrl}

                    style={{

                      display: "inline-flex",

                      alignItems: "center",

                      justifyContent: "center",

                      marginTop: 18,

                      padding: "12px 16px",

                      border: "1px solid currentColor",

                      color: "inherit",

                      textDecoration: "none",

                      fontSize: 13,

                      fontWeight: 600,

                    }}

                  >

                    OPEN UPI APP · ₹{price}

                  </a>

                </div>

              </div>

            </div>

            <div

              style={{

                marginTop: 35,

                display: "grid",

                gap: 15,

              }}

            >

              <PaymentPoint

                text="Submit the transaction ID"

              />

              <PaymentPoint

                text="Upload your payment screenshot"

              />

              <PaymentPoint

                text="Wait for manual verification"

              />

            </div>

          </section>

          <section

            className="payment-details"

            style={{

              border:

                "1px solid rgba(0,0,0,0.15)",

              padding: 30,

            }}

          >

            <div

              className="mono"

              style={{

                fontSize: 10,

                marginBottom: 25,

              }}

            >

              PAYMENT DETAILS

            </div>

            <label

              style={{

                display: "block",

              }}

            >

              <span

                className="mono"

                style={{

                  display: "block",

                  fontSize: 10,

                  marginBottom: 9,

                }}

              >

                TRANSACTION ID

              </span>

              <input

                className="payment-transaction-input"

                value={transactionId}

                onChange={(event) => {

                  const value = event.target.value

                    .replace(/\D/g, "")

                    .slice(0, 12);

                  setTransactionId(value);

                }}

                placeholder="ENTER 12-DIGIT TRANSACTION / UTR ID"

                inputMode="numeric"

                pattern="[4-6]\d{11}"

                maxLength={12}

                minLength={12}

                disabled={submitting}

                style={{

                  width: "100%",

                  boxSizing:

                    "border-box",

                  padding:

                    "14px 15px",

                  border:

                    "1px solid rgba(0,0,0,0.2)",

                  background:

                    "transparent",

                  outline: "none",

                }}

              />

            </label>

            <label

              style={{

                display: "block",

                marginTop: 25,

              }}

            >

              <span

                className="mono"

                style={{

                  display: "block",

                  fontSize: 10,

                  marginBottom: 9,

                }}

              >

                PAYMENT SCREENSHOT

              </span>

              <div

                className="payment-upload-box"

                style={{

                  border:

                    "1px dashed rgba(0,0,0,0.25)",

                  padding: 25,

                  textAlign:

                    "center",

                  cursor:

                    submitting

                      ? "default"

                      : "pointer",

                }}

                onClick={() => {

                  if (submitting) {

                    return;

                  }

                  document

                    .getElementById(

                      "payment-screenshot"

                    )

                    ?.click();

                }}

              >

                <Upload

                  size={22}

                  style={{

                    marginBottom: 10,

                  }}

                />

                <div

                  style={{

                    fontSize: 14,

                    fontWeight: 600,

                  }}

                >

                  {paymentScreenshot

                    ? paymentScreenshot.name

                    : "UPLOAD PAYMENT SCREENSHOT"}

                </div>

                <div

                  style={{

                    marginTop: 6,

                    fontSize: 12,

                    opacity: 0.6,

                  }}

                >

                  JPG, PNG or WEBP · MAX 10 MB

                </div>

                <input

                  id="payment-screenshot"

                  type="file"

                  accept="image/png,image/jpeg,image/webp"

                  hidden

                  disabled={submitting}

                  onChange={(event) => {

                    const file = event.target.files?.[0];

                    if (!file) {

                      return;

                    }

                    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {

                      setError("Only JPG, PNG or WEBP images are allowed.");

                      event.target.value = "";

                      return;

                    }

                    if (file.size > MAX_SCREENSHOT_SIZE) {

                      setError("Payment screenshot must be 10 MB or smaller.");

                      event.target.value = "";

                      return;

                    }

                    setError("");

                    setPaymentScreenshot(file);

                  }}

                />

              </div>

            </label>

            <label

              className="payment-confirmation"

              style={{

                display: "flex",

                alignItems:

                  "flex-start",

                gap: 12,

                marginTop: 25,

                cursor:

                  submitting

                    ? "default"

                    : "pointer",

              }}

            >

              <input

                type="checkbox"

                checked={confirmed}

                disabled={submitting}

                onChange={(event) =>

                  setConfirmed(

                    event.target.checked

                  )

                }

                style={{

                  marginTop: 3,

                }}

              />

              <span

                style={{

                  fontSize: 13,

                  lineHeight: 1.55,

                }}

              >

                I confirm that the payment

                details and transaction ID

                submitted above are correct.

              </span>

            </label>

            {error && (

              <div

                style={{

                  marginTop: 22,

                  padding: 15,

                  border:

                    "1px solid rgba(160,60,50,0.4)",

                  fontSize: 13,

                  lineHeight: 1.5,

                }}

              >

                {error}

              </div>

            )}

            <button

              onClick={submitPayment}

              disabled={submitting}

              style={{

                width: "100%",

                marginTop: 28,

                padding:

                  "16px 18px",

                border:

                  "1px solid currentColor",

                background:

                  submitting

                    ? "rgba(0,0,0,0.08)"

                    : "transparent",

                cursor:

                  submitting

                    ? "not-allowed"

                    : "pointer",

                display: "flex",

                alignItems:

                  "center",

                justifyContent:

                  "space-between",

                gap: 10,

              }}

            >

              <span>

                {submitting

                  ? "SUBMITTING..."

                  : isUpgrade

                    ? "SUBMIT ₹500 UPGRADE"

                    : `SUBMIT PAYMENT · ₹${price}`}

              </span>

              {!submitting && (

                <ArrowRight

                  size={17}

                />

              )}

            </button>

            <div

              style={{

                marginTop: 15,

                fontSize: 11,

                lineHeight: 1.5,

                opacity: 0.6,

                textAlign:

                  "center",

              }}

            >

              Payment is manually verified

              by the PANACEA ’26 team.

            </div>

          </section>

        </div>

      </div>


      <style>{`
        .panacea-payment-page {
          overflow-x: hidden;
        }

        .payment-page-container {
          width: 100%;
          box-sizing: border-box;
        }

        .payment-layout {
          min-width: 0;
        }

        .payment-layout > section {
          min-width: 0;
          box-sizing: border-box;
        }

        .payment-summary,
        .payment-details {
          overflow: hidden;
        }

        .payment-summary {
          overflow-wrap: anywhere;
        }

        .payment-summary > div,
        .payment-details > div,
        .payment-details label,
        .upi-info {
          min-width: 0;
        }

        .upi-payment-grid {
          min-width: 0;
        }

        .upi-qr-box {
          max-width: 100%;
        }

        .upi-qr-box img {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        .upi-info {
          overflow-wrap: anywhere;
        }

        .payment-upload-box {
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          overflow-wrap: anywhere;
        }

        .payment-confirmation span {
          min-width: 0;
          overflow-wrap: anywhere;
        }

        @media (max-width: 768px) {
          .panacea-payment-page {
            width: 100% !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            padding: 24px 12px 50px !important;
            overflow-x: hidden !important;
          }

          .payment-page-container {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }

          .payment-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }

          .payment-layout > section {
            width: 100%;
            padding: 20px !important;
          }

          .payment-pass-label {
            font-size: 23px !important;
            line-height: 1.2 !important;
          }

          .payment-amount {
            font-size: 42px !important;
          }

          .upi-payment-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 18px !important;
            justify-items: stretch;
          }

          .upi-qr-box {
            width: 180px !important;
            height: 180px !important;
          }

          .upi-info {
            width: 100%;
            text-align: left;
          }

          .upi-info a {
            width: 100%;
            box-sizing: border-box;
          }

          .payment-upload-box {
            min-height: 150px;
            padding: 20px 14px !important;
          }

          .payment-details input {
            font-size: 16px !important;
            min-width: 0;
          }

          .payment-confirmation {
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .panacea-payment-page {
            padding: 18px 8px 40px !important;
          }

          .payment-layout > section {
            padding: 16px !important;
          }

          .payment-pass-label {
            font-size: 20px !important;
          }

          .payment-amount {
            font-size: 36px !important;
          }

          .upi-payment-grid {
            gap: 14px !important;
          }

          .upi-qr-box {
            width: 164px !important;
            height: 164px !important;
          }

          .upi-qr-box img {
            width: 148px !important;
            height: 148px !important;
          }

          .upi-info > div:first-child {
            font-size: 15px !important;
          }

          .payment-upload-box {
            min-height: 140px;
            padding: 18px 10px !important;
          }

          .payment-confirmation span {
            font-size: 12px !important;
          }
        }
      `}</style>

    </main>

  );

}

function PaymentPoint({

  text,

}: {

  text: string;

}) {

  return (

    <div

      style={{

        display: "flex",

        alignItems:

          "flex-start",

        gap: 10,

        fontSize: 14,

        lineHeight: 1.5,

      }}

    >

      <Check

        size={16}

        style={{

          flexShrink: 0,

          marginTop: 2,

        }}

      />

      <span>{text}</span>

    </div>

  );

}