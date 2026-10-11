import { useEffect, useState } from "react";

import {
  adminApi,
  type AdminBrCardPayment,
} from "@/api/adminApi";

export default function AdminPayment() {
  const [payments, setPayments] = useState<AdminBrCardPayment[]>([]);
  const [selected, setSelected] =
    useState<AdminBrCardPayment | null>(null);

  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  /* =========================================================
     LOAD PAYMENTS
  ========================================================= */

  const loadPayments = async () => {
    try {
      const data = await adminApi.getPendingPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  /* =========================================================
     NORMALIZED PAYMENT DATA
  ========================================================= */

  /**
   * IMPORTANT:
   *
   * Backend response:
   *
   * {
   *   passType: "WITHOUT_ACCOMMODATION",
   *   expectedAmount: 1000,
   *   paymentAmount: 500,
   *   upgrade: true
   * }
   *
   * `upgrade` is the source of truth.
   */

  const isUpgrade = (
    payment: AdminBrCardPayment
  ): boolean => {
    const raw = payment as AdminBrCardPayment & {
      upgrade?: boolean;
    };

    return raw.upgrade === true;
  };

  /**
   * Get the actual amount paid by the user.
   */
  const getAmountPaid = (
    payment: AdminBrCardPayment
  ): number => {
    const raw = payment as AdminBrCardPayment & {
      paymentAmount?: number | string;
    };

    return Number(raw.paymentAmount ?? 0);
  };

  /**
   * Get expected amount.
   *
   * This is intentionally separate from amount paid.
   */
  const getExpectedAmount = (
    payment: AdminBrCardPayment
  ): number => {
    return Number(payment.expectedAmount ?? 0);
  };

  /**
   * Payment amount displayed in the payment card.
   *
   * Upgrade:
   *      show PAYMENT AMOUNT, e.g. ₹500
   *
   * Normal:
   *      show EXPECTED AMOUNT
   */
  const getDisplayAmount = (
    payment: AdminBrCardPayment
  ): number => {
    if (isUpgrade(payment)) {
      return getAmountPaid(payment);
    }

    return getExpectedAmount(payment);
  };

  /* =========================================================
     PAYMENT LABEL
  ========================================================= */

  const getPaymentLabel = (
    payment: AdminBrCardPayment
  ): string => {
    if (isUpgrade(payment)) {
      return "ACCOMMODATION UPGRADE REQUEST";
    }

    if (
      payment.passType === "WITH_ACCOMMODATION"
    ) {
      return "WITH ACCOMMODATION";
    }

    return "WITHOUT ACCOMMODATION";
  };

  /**
   * Original card/pass type.
   *
   * For upgrade requests we still display the original
   * pass type because the upgrade is being requested FROM
   * that existing card.
   */
  const getOriginalPassLabel = (
    payment: AdminBrCardPayment
  ): string => {
    if (
      payment.passType === "WITH_ACCOMMODATION"
    ) {
      return "WITH ACCOMMODATION";
    }

    return "WITHOUT ACCOMMODATION";
  };

  /* =========================================================
     APPROVE PAYMENT
  ========================================================= */

  const approve = async (
    paymentId: number
  ) => {
    try {
      setProcessing(true);

      await adminApi.approvePayment(paymentId);

      setSelected(null);
      setRejectReason("");

      await loadPayments();
    } catch (error) {
      console.error(
        "Payment approval failed:",
        error
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     REJECT PAYMENT
  ========================================================= */

  const reject = async (
    paymentId: number
  ) => {
    if (!rejectReason.trim()) {
      return;
    }

    try {
      setProcessing(true);

      await adminApi.rejectPayment(
        paymentId,
        rejectReason.trim()
      );

      setRejectReason("");
      setSelected(null);

      await loadPayments();
    } catch (error) {
      console.error(
        "Payment rejection failed:",
        error
      );
    } finally {
      setProcessing(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-payment-page">
      <style>{`
        /* =====================================================
           BASE
        ===================================================== */

        .admin-payment-page {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;

          padding: 0 20px 60px;

          min-width: 0;
          box-sizing: border-box;

          overflow-x: hidden;
        }

        .admin-payment-page *,
        .admin-payment-page *::before,
        .admin-payment-page *::after {
          box-sizing: border-box;
        }

        /* =====================================================
           PAYMENT CARD
        ===================================================== */

        .payment-card {
          width: 100%;
          min-width: 0;

          background: #FFFDF8;

          border: 1px solid #D8CCBA;

          box-shadow: 7px 7px 0 #D8CCBA;

          padding: 24px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            auto;

          gap: 24px;

          align-items: center;

          overflow: hidden;
        }

        .payment-card-content {
          min-width: 0;
        }

        .payment-card-title {
          margin: 0;

          color: #24211D;

          font-size:
            clamp(21px, 2vw, 28px);

          line-height: 1.1;

          font-weight: 800;

          overflow-wrap: anywhere;
        }

        /* =====================================================
           PAYMENT BADGE
        ===================================================== */

        .payment-badge {
          display: inline-block;

          margin-top: 10px;

          padding: 6px 9px;

          background: #F7E5B8;

          color: #805C2A;

          border: 1px solid #D8CCBA;

          font-size: 10px;

          letter-spacing: 0.08em;

          line-height: 1.35;

          max-width: 100%;

          overflow-wrap: anywhere;
        }

        /* =====================================================
           PAYMENT META
        ===================================================== */

        .payment-meta {
          margin-top: 14px;

          display: flex;

          flex-wrap: wrap;

          gap: 12px 22px;

          color: #625B52;

          font-size: 14px;
        }

        .payment-meta span {
          min-width: 0;

          overflow-wrap: anywhere;

          word-break: break-word;
        }

        .payment-action {
          flex-shrink: 0;

          width: 150px;
        }

        .payment-action button {
          width: 100%;
        }

        /* =====================================================
           MODAL
        ===================================================== */

        .payment-modal-overlay {
          position: fixed;

          inset: 0;

          background:
            rgba(36, 33, 29, 0.72);

          z-index: 100;

          padding: 24px;

          overflow-y: auto;

          overflow-x: hidden;

          display: flex;

          align-items: flex-start;

          justify-content: center;
        }

        .payment-modal {
          width: 100%;

          max-width: 900px;

          margin: 30px auto;

          background: #FFFDF8;

          border: 1px solid #D8CCBA;

          box-shadow:
            10px 10px 0
            rgba(36, 33, 29, 0.25);

          padding: 30px;

          min-width: 0;
        }

        /* =====================================================
           MODAL HEADER
        ===================================================== */

        .modal-header {
          display: flex;

          justify-content: space-between;

          align-items: flex-start;

          gap: 20px;

          min-width: 0;
        }

        .modal-header-content {
          min-width: 0;

          flex: 1;
        }

        .modal-title {
          margin: 10px 0 0;

          font-size:
            clamp(27px, 5vw, 42px);

          line-height: 1;

          color: #24211D;

          overflow-wrap: anywhere;
        }

        .modal-subtitle {
          margin: 8px 0 0;

          font-size: 13px;

          line-height: 1.5;

          color: #6F665A;

          overflow-wrap: anywhere;
        }

        .modal-close {
          width: 48px;

          height: 48px;

          flex: 0 0 48px;

          background: #F1E8D9;

          border: 1px solid #D8CCBA;

          color: #6F665A;

          font-size: 24px;

          cursor: pointer;
        }

        /* =====================================================
           DETAILS
        ===================================================== */

        .modal-details {
          margin-top: 28px;

          display: grid;

          gap: 10px;

          font-size: 15px;

          color: #24211D;

          min-width: 0;
        }

        .modal-detail-row {
          min-width: 0;

          overflow-wrap: anywhere;

          word-break: break-word;
        }

        /* =====================================================
           UPGRADE INFORMATION
        ===================================================== */

        .upgrade-info {
          margin-top: 8px;

          padding: 16px;

          background: #F7E5B8;

          border: 1px solid #D8CCBA;

          color: #805C2A;

          font-size: 13px;

          line-height: 1.6;

          overflow-wrap: anywhere;
        }

        .upgrade-price {
          margin-top: 10px;

          font-size: 22px;

          font-weight: 900;

          color: #24211D;
        }

        /* =====================================================
           SCREENSHOT
        ===================================================== */

        .screenshot-wrapper {
          width: 100%;

          min-width: 0;

          margin-top: 30px;
        }

        .payment-screenshot {
          display: block;

          width: 100%;

          max-width: 100%;

          max-height: 600px;

          object-fit: contain;

          border: 1px solid #D8CCBA;

          background: #F1E8D9;

          margin: 0 auto;
        }

        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .modal-actions {
          margin-top: 30px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;

          width: 100%;
        }

        .modal-action-button {
          width: 100%;

          min-width: 0;

          padding: 17px;

          font-weight: 800;

          cursor: pointer;

          overflow-wrap: anywhere;
        }

        /* =====================================================
           REJECTION
        ===================================================== */

        .reject-textarea {
          width: 100%;

          margin-top: 16px;

          padding: 14px;

          border: 1px solid #D8CCBA;

          background: #FBF6ED;

          color: #24211D;

          resize: vertical;

          box-sizing: border-box;

          font-family: inherit;

          min-height: 90px;
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {
          .admin-payment-page {
            padding-left: 14px;

            padding-right: 14px;

            padding-bottom: 40px;
          }

          .payment-card {
            grid-template-columns: 1fr;

            gap: 20px;

            padding: 20px;

            box-shadow:
              5px 5px 0 #D8CCBA;
          }

          .payment-action {
            width: 100%;

            min-width: 0;
          }

          .payment-action button {
            width: 100%;
          }

          .payment-modal-overlay {
            padding: 16px;
          }

          .payment-modal {
            margin: 16px auto;

            padding: 22px;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 600px) {
          .admin-payment-page {
            padding-left: 10px;

            padding-right: 10px;

            padding-bottom: 28px;
          }

          .admin-payment-page header {
            margin-bottom: 28px !important;
          }

          .admin-payment-page h1 {
            font-size:
              clamp(40px, 14vw, 58px) !important;

            line-height: 0.92 !important;
          }

          .payment-queue {
            padding: 15px 16px !important;

            margin-bottom: 24px !important;
          }

          .payment-queue strong {
            margin-left: 10px !important;

            font-size: 16px !important;
          }

          .payment-card {
            padding: 17px;

            gap: 18px;

            box-shadow:
              4px 4px 0 #D8CCBA;
          }

          .payment-card-title {
            font-size: 21px;
          }

          .payment-meta {
            gap: 9px 14px;

            font-size: 13px;
          }

          .payment-action button {
            padding: 14px 16px !important;
          }

          .payment-modal-overlay {
            padding: 8px;
          }

          .payment-modal {
            margin: 8px auto;

            padding: 17px;

            box-shadow:
              5px 5px 0
              rgba(36, 33, 29, 0.25);
          }

          .modal-header {
            gap: 12px;
          }

          .modal-title {
            font-size: 30px;
          }

          .modal-close {
            width: 42px;

            height: 42px;

            flex-basis: 42px;

            font-size: 21px;
          }

          .modal-details {
            font-size: 14px;

            gap: 12px;
          }

          .modal-actions {
            grid-template-columns: 1fr;

            gap: 10px;
          }

          .modal-action-button {
            padding: 15px;
          }

          .payment-screenshot {
            max-height: 500px;
          }

          .reject-textarea {
            font-size: 14px;
          }
        }

        /* =====================================================
           VERY SMALL PHONES
        ===================================================== */

        @media (max-width: 380px) {
          .admin-payment-page {
            padding-left: 8px;

            padding-right: 8px;
          }

          .payment-card {
            padding: 14px;
          }

          .payment-card-title {
            font-size: 19px;
          }

          .payment-meta {
            display: grid;

            grid-template-columns: 1fr;

            gap: 8px;
          }

          .payment-modal {
            padding: 14px;
          }

          .modal-title {
            font-size: 25px;
          }
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          marginBottom: 44,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "#9A7135",
            marginBottom: 12,
          }}
        >
          PANACEA 2026 / PAYMENTS
        </div>

        <h1
          style={{
            margin: 0,

            fontSize:
              "clamp(42px, 6vw, 72px)",

            fontWeight: 900,

            letterSpacing: "-0.06em",

            lineHeight: 0.9,

            color: "#24211D",
          }}
        >
          Payments
        </h1>

        <p
          style={{
            color: "#6F665A",

            marginTop: 18,
          }}
        >
          Verify BR Card payments manually.
        </p>
      </header>

      {/* =====================================================
          PAYMENT QUEUE
      ===================================================== */}

      <div
        className="payment-queue"
        style={{
          background: "#24211D",

          color: "#F6F1E7",

          border: "1px solid #24211D",

          padding: "18px 22px",

          boxShadow:
            "6px 6px 0 #9A7135",

          marginBottom: 36,

          display: "flex",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 8,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,

            letterSpacing: "0.1em",

            color: "#E4C77A",
          }}
        >
          PAYMENT QUEUE
        </span>

        <strong
          style={{
            marginLeft: 16,

            fontSize: 18,
          }}
        >
          {payments.length} PENDING
        </strong>
      </div>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {payments.length === 0 && (
        <div
          style={{
            background: "#FFFDF8",

            color: "#24211D",

            padding: 40,

            border:
              "1px solid #D8CCBA",

            boxShadow:
              "7px 7px 0 #D8CCBA",

            width: "100%",
          }}
        >
          <div
            className="mono"
            style={{
              color: "#9A7135",

              fontSize: 11,

              letterSpacing: "0.1em",
            }}
          >
            QUEUE CLEAR
          </div>

          <h2
            style={{
              margin: "12px 0 0",

              fontSize: 32,
            }}
          >
            No pending payments.
          </h2>
        </div>
      )}

      {/* =====================================================
          PAYMENT LIST
      ===================================================== */}

      <div
        style={{
          display: "grid",

          gap: 18,

          width: "100%",

          minWidth: 0,
        }}
      >
        {payments.map((payment) => {
          const upgrade = isUpgrade(payment);

          const amountPaid =
            getAmountPaid(payment);

          const expectedAmount =
            getExpectedAmount(payment);

          return (
            <div
              key={payment.paymentId}
              className="payment-card"
            >
              {/* -------------------------------------------------
                  PAYMENT INFORMATION
              ------------------------------------------------- */}

              <div className="payment-card-content">
                <div
                  className="mono"
                  style={{
                    fontSize: 10,

                    letterSpacing: "0.1em",

                    marginBottom: 10,

                    color: "#6F665A",
                  }}
                >
                  PAYMENT #{payment.paymentId}
                </div>

                <h2 className="payment-card-title">
                  {getPaymentLabel(payment)}
                </h2>

                {/* -------------------------------------------------
                    UPGRADE BADGE
                ------------------------------------------------- */}

                {upgrade && (
                  <div
                    className="mono payment-badge"
                  >
                    EXISTING BR CARD · UPGRADE REQUEST
                  </div>
                )}

                {/* -------------------------------------------------
                    PAYMENT META
                ------------------------------------------------- */}

                <div className="payment-meta">
                  <span>
                    <strong
                      style={{
                        color: "#24211D",
                      }}
                    >
                      ₹
                      {upgrade
                        ? amountPaid
                        : expectedAmount}
                    </strong>

                    {upgrade && (
                      <span
                        style={{
                          marginLeft: 7,

                          fontSize: 11,

                          color: "#805C2A",
                        }}
                      >
                        AMOUNT PAID
                      </span>
                    )}
                  </span>

                  <span>
                    UTR:{" "}
                    <strong
                      style={{
                        color: "#24211D",
                      }}
                    >
                      {payment.transactionId}
                    </strong>
                  </span>

                  <span>
                    User:{" "}
                    <strong
                      style={{
                        color: "#24211D",
                      }}
                    >
                      #{payment.userId}
                    </strong>
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------
                  VIEW DETAILS
              ------------------------------------------------- */}

              <div className="payment-action">
                <button
                  className="mono"
                  onClick={() => {
                    setRejectReason("");

                    setSelected(payment);
                  }}
                  style={{
                    background: "#24211D",

                    color: "#F6F1E7",

                    border:
                      "1px solid #24211D",

                    padding:
                      "14px 20px",

                    cursor: "pointer",

                    fontSize: 11,

                    letterSpacing:
                      "0.08em",
                  }}
                >
                  VIEW DETAILS ↗
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          PAYMENT REVIEW MODAL
      ===================================================== */}

      {selected && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            {/* -------------------------------------------------
                MODAL HEADER
            ------------------------------------------------- */}

            <div className="modal-header">
              <div
                className="modal-header-content"
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,

                    letterSpacing:
                      "0.1em",

                    color: "#9A7135",
                  }}
                >
                  {isUpgrade(selected)
                    ? "ACCOMMODATION UPGRADE REQUEST"
                    : "PAYMENT REVIEW"}
                </div>

                <h2 className="modal-title">
                  ₹{getDisplayAmount(selected)}
                </h2>

                {isUpgrade(selected) && (
                  <p className="modal-subtitle">
                    Amount paid for accommodation
                    upgrade
                  </p>
                )}
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  if (!processing) {
                    setSelected(null);

                    setRejectReason("");
                  }
                }}
                disabled={processing}
                aria-label="Close payment details"
              >
                ×
              </button>
            </div>

            {/* -------------------------------------------------
                PAYMENT DETAILS
            ------------------------------------------------- */}

            <div className="modal-details">
              <div className="modal-detail-row">
                <strong>
                  Transaction:
                </strong>{" "}
                {selected.transactionId}
              </div>

              <div className="modal-detail-row">
                <strong>
                  Request:
                </strong>{" "}
                {getPaymentLabel(selected)}
              </div>

              {/* UPGRADE: PAYMENT AMOUNT
                  NORMAL: EXPECTED AMOUNT */}

              <div className="modal-detail-row">
                <strong>
                  {isUpgrade(selected)
                    ? "Amount Paid:"
                    : "Expected Amount:"}
                </strong>{" "}
                ₹{getDisplayAmount(selected)}
              </div>

              {/* Show expected amount separately only
                  for upgrade requests if useful for
                  reference, but NEVER call it amount paid. */}

              {isUpgrade(selected) && (
                <div className="modal-detail-row">
                  <strong>
                    Original Card Type:
                  </strong>{" "}
                  {getOriginalPassLabel(
                    selected
                  )}
                </div>
              )}

              <div className="modal-detail-row">
                <strong>
                  User:
                </strong>{" "}
                #{selected.userId}
              </div>

              <div className="modal-detail-row">
                <strong>
                  BR Card:
                </strong>{" "}
                #{selected.brCardId}
              </div>

              <div className="modal-detail-row">
                <strong>
                  Card ID:
                </strong>{" "}
                {selected.cardId}
              </div>

              {/* -------------------------------------------------
                  UPGRADE INFORMATION
              ------------------------------------------------- */}

              {isUpgrade(selected) && (
                <div className="upgrade-info">
                  <strong>
                    ACCOMMODATION UPGRADE REQUEST
                  </strong>

                  <br />

                  This payment is from an existing
                  BR Card holder requesting an
                  accommodation upgrade.

                  <br />

                  <div className="upgrade-price">
                    ₹{getAmountPaid(selected)}
                    <span
                      style={{
                        fontSize: 11,

                        fontWeight: 600,

                        marginLeft: 8,

                        color: "#805C2A",
                      }}
                    >
                      AMOUNT PAID
                    </span>
                  </div>

                  <br />

                  Approval should keep the same
                  BR Card ID and QR code while
                  upgrading the card to{" "}
                  <strong>
                    With Accommodation
                  </strong>.
                </div>
              )}
            </div>

            {/* =================================================
                PAYMENT SCREENSHOT
            ================================================= */}

            {selected.paymentScreenshotUrl && (
              <div className="screenshot-wrapper">
                <div
                  className="mono"
                  style={{
                    fontSize: 10,

                    letterSpacing:
                      "0.1em",

                    marginBottom: 12,

                    color: "#6F665A",
                  }}
                >
                  PAYMENT SCREENSHOT
                </div>

                <img
                  src={
                    selected.paymentScreenshotUrl
                  }
                  alt="Payment screenshot"
                  className="payment-screenshot"
                />
              </div>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="modal-actions">
              <button
                className="modal-action-button"
                onClick={() =>
                  approve(
                    selected.paymentId
                  )
                }
                disabled={processing}
                style={{
                  background: "#E4C77A",

                  color: "#24211D",

                  border:
                    "1px solid #9A7135",

                  cursor: processing
                    ? "not-allowed"
                    : "pointer",

                  opacity:
                    processing
                      ? 0.6
                      : 1,
                }}
              >
                {processing
                  ? "PROCESSING..."
                  : isUpgrade(selected)
                    ? "APPROVE UPGRADE"
                    : "APPROVE PAYMENT"}
              </button>

              <button
                className="modal-action-button"
                onClick={() =>
                  reject(
                    selected.paymentId
                  )
                }
                disabled={
                  processing ||
                  !rejectReason.trim()
                }
                style={{
                  background: "#24211D",

                  color: "#F6F1E7",

                  border:
                    "1px solid #24211D",

                  cursor:
                    processing ||
                    !rejectReason.trim()
                      ? "not-allowed"
                      : "pointer",

                  opacity:
                    processing ||
                    !rejectReason.trim()
                      ? 0.55
                      : 1,
                }}
              >
                {processing
                  ? "PROCESSING..."
                  : isUpgrade(selected)
                    ? "REJECT UPGRADE"
                    : "REJECT PAYMENT"}
              </button>
            </div>

            {/* =================================================
                REJECTION REASON
            ================================================= */}

            <textarea
              value={rejectReason}
              onChange={(event) =>
                setRejectReason(
                  event.target.value
                )
              }
              placeholder={
                isUpgrade(selected)
                  ? "Reason for rejecting accommodation upgrade"
                  : "Rejection reason"
              }
              rows={3}
              disabled={processing}
              className="reject-textarea"
            />
          </div>
        </div>
      )}
    </div>
  );
}