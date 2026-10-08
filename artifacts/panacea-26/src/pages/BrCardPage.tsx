import { useEffect, useState } from "react";

import {
  ArrowDown,
  ArrowRight,
} from "lucide-react";

import { useLocation } from "wouter";

import type { ReactNode } from "react";

import PageTitle from "../components/PageTitle";
import { useAuth } from "../context/AuthContext";

import {
  brCardApi,
  type BrCardResponse,
} from "../api/brCardApi";

export default function BrCardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [termsExpanded, setTermsExpanded] =
    useState(false);

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  /*
   * Existing BR Card check
   *
   * We check the backend only when the user
   * is logged in.
   */
  const [checkingCard, setCheckingCard] =
    useState(true);

  const [existingCard, setExistingCard] =
    useState<BrCardResponse | null>(null);

  useEffect(() => {
    if (!user) {
      setCheckingCard(false);
      setExistingCard(null);
      return;
    }

    let cancelled = false;

    const checkExistingCard = async () => {
      try {
        setCheckingCard(true);

        const card =
          await brCardApi.getMyBrCard();

        if (!cancelled && card) {
          setExistingCard(card);
        }
      } catch (error) {
        /*
         * No existing BR Card is fine.
         * The user can purchase one.
         */
        if (!cancelled) {
          setExistingCard(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingCard(false);
        }
      }
    };

    checkExistingCard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /*
   * Existing card states
   */
  const hasActiveCard =
    existingCard?.status === "ACTIVE";

  const paymentPending =
    existingCard?.status ===
    "PAYMENT_PENDING";

  return (
    <main
      className="shell"
      style={{
        paddingBottom: 100,
      }}
    >
      {/* =====================================================
          PAGE INTRO
          ===================================================== */}

      <PageTitle
        tag="Access pass"
        title="BR CARD."
        sub="Your key to the PANACEA experience."
      />

      {/* =====================================================
          MAIN BR CARD SECTION
          ===================================================== */}

      <div
        className="br-card-layout"
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 52,
          alignItems: "start",
          paddingBottom: 90,
        }}
      >
        {/* =================================================
            LEFT — BR CARD PREVIEW
            ================================================= */}

        <div>
          <div
            className="panacea-pass"
            style={{
              position: "relative",
              minHeight: 510,
              background: "#ff3f78",
              border: "1px solid #111",
              boxShadow: "9px 9px 0 #111",
              padding: "55px 50px 35px",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* BLUE DECORATIVE CIRCLE */}

            <div
              style={{
                position: "absolute",
                width: 330,
                height: 330,
                borderRadius: "50%",
                border:
                  "28px solid #21a9dc",
                right: -145,
                top: -155,
                boxSizing: "border-box",
              }}
            />

            {/* YELLOW DECORATIVE CIRCLE */}

            <div
              style={{
                position: "absolute",
                width: 275,
                height: 275,
                borderRadius: "50%",
                border:
                  "25px solid #f5b719",
                right: -120,
                top: -125,
                boxSizing: "border-box",
              }}
            />

            {/* CARD HEADER */}

            <div
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                position: "relative",
                zIndex: 2,
              }}
            >
              GOVERNMENT MEDICAL COLLEGE
              <span
                style={{
                  marginLeft: 40,
                }}
              >
                KATHUA
              </span>
            </div>

            {/* CARD TITLE */}

            <h2
              className="display"
              style={{
                position: "relative",
                zIndex: 2,
                margin: "10px 0 0",
                fontSize:
                  "clamp(52px, 5vw, 78px)",
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
              }}
            >
              PANACEA
              <br />
              ’26
              <br />

              <span
                style={{
                  color: "#f5eddf",
                  WebkitTextStroke:
                    "1.5px #111",
                }}
              >
                BR CARD
              </span>
            </h2>

            {/* DATE */}

            <div
              className="mono"
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: 12,
                marginTop: 13,
                letterSpacing: "0.05em",
              }}
            >
              28—31 OCTOBER 2026
            </div>

            {/* BOTTOM CARD CONTENT */}

            <div
              className="br-card-bottom"
              style={{
                position: "absolute",
                left: 50,
                right: 50,
                bottom: 35,
                display: "flex",
                alignItems: "flex-end",
                justifyContent:
                  "space-between",
                gap: 30,
              }}
            >
              {/* ACCOUNT DETAILS */}

              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing:
                      "0.07em",
                    marginBottom: 7,
                  }}
                >
                  {user?.fullName?.toUpperCase() ||
                    "PANACEA ACCOUNT HOLDER"}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 17,
                    lineHeight: 1.45,
                  }}
                >
                  {user?.collegeName ||
                    "College details"}
                  <br />
                  VALIDITY · 28—31 OCT 2026
                </p>
              </div>

              {/* QR PLACEHOLDER */}

              <div
                style={{
                  width: 125,
                  height: 125,
                  flexShrink: 0,
                  background: "#f5eddf",
                  border: "1px solid #111",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                aria-label="BR Card QR code"
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      linear-gradient(
                        45deg,
                        #111 25%,
                        transparent 25%
                      ),
                      linear-gradient(
                        -45deg,
                        #111 25%,
                        transparent 25%
                      ),
                      linear-gradient(
                        45deg,
                        transparent 75%,
                        #111 75%
                      ),
                      linear-gradient(
                        -45deg,
                        transparent 75%,
                        #111 75%
                      )
                    `,
                    backgroundSize:
                      "22px 22px",
                    backgroundPosition:
                      "0 0, 0 11px, 11px -11px, -11px 0px",
                    opacity: 0.95,
                  }}
                />
              </div>
            </div>

            {/* PASS ID */}

            <div
              className="mono"
              style={{
                position: "absolute",
                left: 50,
                bottom: 12,
                fontSize: 9,
                letterSpacing:
                  "0.06em",
              }}
            >
              PASS ID · GENERATED ON CLAIM
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT — PASS DETAILS
            ================================================= */}

        <div>
          <h2
            className="display"
            style={{
              margin: "5px 0 30px",
              fontSize:
                "clamp(40px, 4vw, 58px)",
              lineHeight: 0.86,
              letterSpacing:
                "-0.055em",
            }}
          >
            THE PASS
            <br />
            DETAILS.
          </h2>

          {/* =================================================
              PRICE
              ================================================= */}

          <PassInfo
            label="PRICE"
            value={
              <>
                ₹1,000 — Without Accommodation
                <br />
                ₹1,500 — With Accommodation
              </>
            }
          />

          {/* =================================================
              VALIDITY
              ================================================= */}

          <PassInfo
            label="VALIDITY"
            value={
              <>
                28–31 October 2026
                <br />
                Valid throughout PANACEA ’26
                at Government Medical College
                Kathua.
              </>
            }
          />

          {/* =================================================
              BENEFITS
              ================================================= */}

          <PassInfo
            label="BENEFITS"
            value={
              <div
                style={{
                  display: "grid",
                  gap: 7,
                }}
              >
                <div>
                  • Access to PANACEA ’26
                  events and activities
                </div>

                <div>
                  • Entry to the cultural and
                  entertainment nights
                </div>

                <div>
                  • Access to sports and
                  academic events
                </div>

                <div>
                  • Participation/entry to
                  eligible competitions and
                  activities
                </div>

                <div>
                  • Accommodation included with
                  the ₹1,500 pass
                </div>

                <div>
                  • Exclusive PANACEA ’26 BR Card
                </div>
              </div>
            }
          />

          {/* =================================================
              TERMS & CONDITIONS ACCORDION
              ================================================= */}

          <div
            style={{
              borderBottom:
                "1px solid rgba(0,0,0,0.55)",
              marginBottom: 22,
            }}
          >
            {/* ACCORDION HEADER */}

            <button
              type="button"
              onClick={() =>
                setTermsExpanded(
                  (previous) => !previous
                )
              }
              aria-expanded={
                termsExpanded
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: 20,
                border: "none",
                background:
                  "transparent",
                padding:
                  "0 0 20px",
                cursor: "pointer",
                color: "#111",
                textAlign: "left",
                fontFamily:
                  "inherit",
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    letterSpacing:
                      "0.08em",
                    marginBottom: 10,
                  }}
                >
                  TERMS & CONDITIONS
                </div>

                <div
                  style={{
                    fontSize: 17,
                    lineHeight: 1.35,
                  }}
                >
                  Please read and accept
                  the terms
                </div>
              </div>

              <ArrowDown
                size={18}
                strokeWidth={1.5}
                style={{
                  flexShrink: 0,
                  transform:
                    termsExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  transition:
                    "transform 180ms ease",
                }}
              />
            </button>

            {/* EXPANDED TERMS */}

            {termsExpanded && (
              <div
                style={{
                  padding:
                    "0 0 22px",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {/* TERMS LIST */}

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    marginBottom: 22,
                  }}
                >
                  <div>
                    • The BR Card is personal
                    and non-transferable.
                  </div>

                  <div>
                    • Valid registration and
                    payment are required for
                    confirmation.
                  </div>

                  <div>
                    • Event access may be
                    subject to venue capacity
                    and individual event rules.
                  </div>

                  <div>
                    • Accommodation is available
                    only with the
                    accommodation-inclusive
                    pass.
                  </div>

                  <div>
                    • PANACEA ’26 reserves the
                    right to modify the event
                    schedule or access guidelines
                    if required.
                  </div>
                </div>

                {/* REQUIRED ACCEPTANCE */}

                <label
                  style={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 12,
                    cursor: "pointer",
                    padding:
                      "14px 15px",
                    border:
                      "1px solid #111",
                    background:
                      termsAccepted
                        ? "rgba(245,183,25,0.18)"
                        : "transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      termsAccepted
                    }
                    onChange={(event) =>
                      setTermsAccepted(
                        event.target
                          .checked
                      )
                    }
                    style={{
                      width: 17,
                      height: 17,
                      marginTop: 2,
                      accentColor:
                        "#111",
                      cursor:
                        "pointer",
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: 1.45,
                    }}
                  >
                    I have read and agree
                    to the{" "}
                    <strong>
                      Terms & Conditions
                    </strong>{" "}
                    of PANACEA ’26 and
                    understand that the BR
                    Card is personal and
                    non-transferable.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* =================================================
              CTA
              ================================================= */}

          <div
            style={{
              marginTop: 22,
            }}
          >
            {/* -------------------------------------------------
                CHECKING EXISTING CARD
                ------------------------------------------------- */}

            {checkingCard && user ? (
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing:
                    "0.07em",
                  padding:
                    "15px 0",
                }}
              >
                CHECKING BR CARD STATUS...
              </div>
            ) : hasActiveCard ? (
              /* -------------------------------------------------
                 ACTIVE CARD — ALREADY PURCHASED
                 ------------------------------------------------- */
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLocation(
                      "/br-card/status"
                    )
                  }
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 12,
                    border:
                      "1px solid #111",
                    background:
                      "#f5b719",
                    color: "#111",
                    padding:
                      "15px 20px",
                    boxShadow:
                      "5px 5px 0 #111",
                    cursor:
                      "pointer",
                    fontFamily:
                      "inherit",
                    fontSize: 11,
                    letterSpacing:
                      "0.07em",
                  }}
                >
                  BR CARD ALREADY PURCHASED

                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                  />
                </button>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  You already have an active
                  PANACEA ’26 BR Card.
                  <br />

                  <button
                    type="button"
                    onClick={() =>
                      setLocation(
                        "/profile"
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      padding: 0,
                      marginTop: 5,
                      cursor:
                        "pointer",
                      color: "#111",
                      textDecoration:
                        "underline",
                      fontFamily:
                        "inherit",
                      fontSize: 14,
                    }}
                  >
                    View your card
                  </button>
                </div>
              </>
            ) : paymentPending ? (
              /* -------------------------------------------------
                 PAYMENT PENDING — DON'T ALLOW SECOND PURCHASE
                 ------------------------------------------------- */
              <>
                <button
                  type="button"
                  disabled
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 12,
                    border:
                      "1px solid #111",
                    background:
                      "#d8d2c5",
                    color: "#555",
                    padding:
                      "15px 20px",
                    cursor:
                      "not-allowed",
                    fontFamily:
                      "inherit",
                    fontSize: 11,
                    letterSpacing:
                      "0.07em",
                  }}
                >
                  PAYMENT UNDER REVIEW
                </button>

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  Your BR Card payment has
                  been submitted and is
                  awaiting verification.
                  <br />

                  <button
                    type="button"
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
                      marginTop: 5,
                      cursor:
                        "pointer",
                      color: "#111",
                      textDecoration:
                        "underline",
                      fontFamily:
                        "inherit",
                      fontSize: 14,
                    }}
                  >
                    Check payment status
                  </button>
                </div>
              </>
            ) : (
              /* -------------------------------------------------
                 NO CARD / REJECTED — ORIGINAL PURCHASE CTA
                 ------------------------------------------------- */
              <>
                <button
                  type="button"
                  disabled={
                    !!user &&
                    !termsAccepted
                  }
                  onClick={() => {
                    if (
                      user &&
                      !termsAccepted
                    ) {
                      setTermsExpanded(
                        true
                      );
                      return;
                    }

                    setLocation(
                      user
                        ? "/br-card/checkout"
                        : "/login"
                    );
                  }}
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 12,
                    border:
                      "1px solid #111",
                    background:
                      user &&
                      !termsAccepted
                        ? "#d8d2c5"
                        : "#ff3f78",
                    color:
                      user &&
                      !termsAccepted
                        ? "#777"
                        : "#111",
                    padding:
                      "15px 20px",
                    boxShadow:
                      user &&
                      !termsAccepted
                        ? "none"
                        : "5px 5px 0 #111",
                    cursor:
                      user &&
                      !termsAccepted
                        ? "not-allowed"
                        : "pointer",
                    fontFamily:
                      "inherit",
                    fontSize: 11,
                    letterSpacing:
                      "0.07em",
                    opacity:
                      user &&
                      !termsAccepted
                        ? 0.75
                        : 1,
                  }}
                >
                  {user
                    ? "GET BR CARD"
                    : "LOGIN TO CONTINUE"}

                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                  />
                </button>

                {!user && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setLocation(
                          "/signup"
                        )
                      }
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        padding: 0,
                        cursor:
                          "pointer",
                        color: "#111",
                        textDecoration:
                          "underline",
                        fontFamily:
                          "inherit",
                        fontSize: 14,
                      }}
                    >
                      Create an account
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          RESPONSIVE
          ===================================================== */}

      <style>
        {`
          @media (max-width: 900px) {
            .br-card-layout {
              grid-template-columns: 1fr !important;
              gap: 55px !important;
            }

            .panacea-pass {
              min-height: 470px !important;
            }
          }

          @media (max-width: 600px) {
            .panacea-pass {
              min-height: 560px !important;
              padding: 35px 25px 30px !important;
            }

            .br-card-bottom {
              left: 25px !important;
              right: 25px !important;
            }

            .panacea-pass > .mono:last-child {
              left: 25px !important;
            }

            .br-card-bottom
              > div:last-child {
              width: 90px !important;
              height: 90px !important;
            }
          }
        `}
      </style>
    </main>
  );
}

/* =========================================================
   PASS INFORMATION ROW
   ========================================================= */

function PassInfo({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div
      style={{
        padding:
          "0 0 20px",
        marginBottom: 17,
        borderBottom:
          "1px solid rgba(0,0,0,0.55)",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing:
            "0.08em",
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 17,
          lineHeight: 1.45,
        }}
      >
        {value}
      </div>
    </div>
  );
}