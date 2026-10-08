import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Download,
  Home,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import PageTitle from "@/components/PageTitle";
import { useAuth } from "../context/AuthContext";
import {
  brCardApi,
  type BrCardResponse,
} from "../api/brCardApi";

export default function BrCardStatusPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const [brCard, setBrCard] =
    useState<BrCardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadBrCard();
  }, [user]);

  const loadBrCard = async () => {
    try {
      setLoading(true);
      setError("");

      const card = await brCardApi.getMyBrCard();

      setBrCard(card);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load BR Card."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              marginBottom: 20,
            }}
          >
            BR CARD / AUTHENTICATION
          </div>

          <h1
            className="display"
            style={{
              fontSize: "clamp(48px, 8vw, 90px)",
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            LOGIN
          </h1>

          <p
            style={{
              marginTop: 24,
              lineHeight: 1.6,
              opacity: 0.75,
            }}
          >
            Please login to view your BR Card status.
          </p>

          <button
            onClick={() => setLocation("/login")}
            style={{
              marginTop: 30,
              padding: "14px 22px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            LOGIN
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="mono">
          LOADING BR CARD...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "70vh",
          padding: "40px 20px",
        }}
      >
        <PageTitle
          tag="BR CARD / ERROR"
          title="ERROR"
          sub="We could not load your BR Card."
        />

        <div
          style={{
            maxWidth: 650,
            padding: 24,
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: 0 }}>
            {error}
          </p>

          <button
            onClick={loadBrCard}
            style={{
              marginTop: 24,
              padding: "12px 18px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </main>
    );
  }

  /*
   * No BR Card exists.
   * Send user to the normal BR Card information/purchase page.
   */
  if (!brCard) {
    return (
      <main
        style={{
          minHeight: "70vh",
          padding: "40px 20px",
        }}
      >
        <PageTitle
          tag="PANACEA ’26 / BR CARD"
          title="GET YOUR BR CARD"
          sub="Your BR Card registration has not been completed yet."
        />

        <div
          style={{
            maxWidth: 650,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setLocation("/br-card")}
            style={{
              padding: "14px 22px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            VIEW BR CARD
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    );
  }

  /*
   * PAYMENT PENDING
   */
  if (brCard.status === "PAYMENT_PENDING") {
    return (
      <main
        style={{
          minHeight: "70vh",
          padding: "40px 20px",
        }}
      >
        <PageTitle
          tag="PANACEA ’26 / BR CARD"
          title="PENDING"
          sub="Your payment proof has been submitted and is awaiting verification."
        />

        <div
          style={{
            maxWidth: 700,
            border: "1px solid rgba(0,0,0,0.15)",
            padding: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <Clock3 size={24} />

            <div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  marginBottom: 5,
                }}
              >
                PAYMENT STATUS
              </div>

              <strong>
                VERIFICATION PENDING
              </strong>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <DetailRow
              label="PASS"
              value={
                brCard.passType ===
                "WITH_ACCOMMODATION"
                  ? "With Accommodation"
                  : "Without Accommodation"
              }
            />

            <DetailRow
              label="AMOUNT"
              value={`₹${brCard.amount}`}
            />

            <DetailRow
              label="TRANSACTION ID"
              value={
                brCard.transactionId || "Submitted"
              }
            />

            <DetailRow
              label="STATUS"
              value="PAYMENT PENDING"
            />
          </div>

          <div
            style={{
              marginTop: 30,
              paddingTop: 24,
              borderTop:
                "1px solid rgba(0,0,0,0.12)",
              fontSize: 14,
              lineHeight: 1.6,
              opacity: 0.75,
            }}
          >
            Our team will verify your payment.
            Once approved, your BR Card and QR
            code will become available here.
          </div>

          <button
            onClick={loadBrCard}
            style={{
              marginTop: 26,
              padding: "12px 18px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            REFRESH STATUS
          </button>
        </div>
      </main>
    );
  }

  /*
   * REJECTED
   */
  if (brCard.status === "REJECTED") {
    return (
      <main
        style={{
          minHeight: "70vh",
          padding: "40px 20px",
        }}
      >
        <PageTitle
          tag="PANACEA ’26 / BR CARD"
          title="REJECTED"
          sub="Your payment could not be verified."
        />

        <div
          style={{
            maxWidth: 700,
            border: "1px solid rgba(0,0,0,0.15)",
            padding: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <X size={25} />

            <strong>
              PAYMENT REJECTED
            </strong>
          </div>

          {brCard.rejectionReason && (
            <div
              style={{
                marginTop: 25,
                padding: 18,
                border:
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
                REASON
              </div>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {brCard.rejectionReason}
              </p>
            </div>
          )}

          <button
            onClick={() => setLocation("/br-card")}
            style={{
              marginTop: 28,
              padding: "14px 22px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            SUBMIT PAYMENT AGAIN
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    );
  }

  /*
   * ACTIVE
   */
  return (
    <ActiveBrCard
      brCard={brCard}
      onBack={() => setLocation("/")}
      onUpgrade={() =>
        setLocation("/br-card/upgrade")
      }
    />
  );
}

function ActiveBrCard({
  brCard,
  onBack,
  onUpgrade,
}: {
  brCard: BrCardResponse;
  onBack: () => void;
  onUpgrade: () => void;
}) {
  const withAccommodation =
    brCard.passType ===
    "WITH_ACCOMMODATION";

  return (
    <main
      style={{
        minHeight: "70vh",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <PageTitle
          tag="PANACEA ’26 / BR CARD"
          title="YOUR BR CARD"
          sub="Your PANACEA ’26 BR Card is active and ready to use."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
            gap: 30,
            alignItems: "stretch",
          }}
        >
          {/* CARD */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.18)",
              padding: 32,
              minHeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  marginBottom: 25,
                }}
              >
                PANACEA ’26 / ACTIVE
              </div>

              <div
                className="display"
                style={{
                  fontSize:
                    "clamp(52px, 7vw, 100px)",
                  lineHeight: 0.9,
                }}
              >
                BR
                <br />
                CARD
              </div>

              <div
                style={{
                  marginTop: 40,
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    marginBottom: 8,
                  }}
                >
                  CARD ID
                </div>

                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {brCard.cardId}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 25,
                marginTop: 50,
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    marginBottom: 8,
                  }}
                >
                  PASS TYPE
                </div>

                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  {withAccommodation
                    ? "WITH ACCOMMODATION"
                    : "WITHOUT ACCOMMODATION"}
                </div>
              </div>

              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    marginBottom: 8,
                  }}
                >
                  AMOUNT
                </div>

                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  ₹{brCard.amount}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 35,
                paddingTop: 22,
                borderTop:
                  "1px solid rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Check size={17} />

              <span
                className="mono"
                style={{
                  fontSize: 11,
                }}
              >
                ACTIVE / VALID 28–31 OCTOBER 2026
              </span>
            </div>
          </div>

          {/* QR + DETAILS */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.18)",
              padding: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                marginBottom: 20,
              }}
            >
              SCAN FOR VERIFICATION
            </div>

            {brCard.qrToken ? (
              <div
                style={{
                  background: "#fff",
                  padding: 18,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <QRCodeSVG
                  value={brCard.qrToken}
                  size={230}
                  level="M"
                />
              </div>
            ) : (
              <div
                style={{
                  width: 230,
                  height: 230,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    "1px solid rgba(0,0,0,0.12)",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                QR CODE UNAVAILABLE
              </div>
            )}

            <div
              style={{
                textAlign: "center",
                marginTop: 25,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                BR Card Active
              </div>

              <p
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                  fontSize: 13,
                  lineHeight: 1.5,
                  opacity: 0.7,
                }}
              >
                Show this QR code at designated
                PANACEA ’26 entry points.
              </p>
            </div>

            {!withAccommodation && (
              <button
                onClick={onUpgrade}
                style={{
                  width: "100%",
                  marginTop: 30,
                  padding: "15px 18px",
                  border: "1px solid currentColor",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span>
                  UPGRADE TO ACCOMMODATION
                </span>

                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>

        {/* PASS DETAILS */}
        <div
          style={{
            marginTop: 30,
            borderTop:
              "1px solid rgba(0,0,0,0.15)",
            paddingTop: 30,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              marginBottom: 22,
            }}
          >
            PASS DETAILS
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            <DetailBox
              label="VALIDITY"
              value="28–31 October 2026"
            />

            <DetailBox
              label="STATUS"
              value="ACTIVE"
            />

            <DetailBox
              label="PASS"
              value={
                withAccommodation
                  ? "Accommodation Included"
                  : "Without Accommodation"
              }
            />

            <DetailBox
              label="VENUE"
              value="Government Medical College Kathua"
            />
          </div>
        </div>

        {/* BENEFITS */}
        <div
          style={{
            marginTop: 50,
            maxWidth: 750,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              marginBottom: 20,
            }}
          >
            YOUR BR CARD INCLUDES
          </div>

          <Benefit text="Access to PANACEA ’26 events and activities" />
          <Benefit text="Entry to cultural and entertainment nights" />
          <Benefit text="Access to sports and academic events" />
          <Benefit text="Participation/entry to eligible competitions and activities" />

          {withAccommodation && (
            <Benefit text="Accommodation included with your pass" />
          )}
        </div>

        {/* BACK */}
        <button
          onClick={onBack}
          style={{
            marginTop: 45,
            padding: "12px 0",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ArrowLeft size={16} />
          BACK TO HOME
        </button>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        paddingBottom: 15,
        borderBottom:
          "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 10,
          opacity: 0.65,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        border:
          "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          marginBottom: 10,
          opacity: 0.65,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "12px 0",
        borderBottom:
          "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Check
        size={17}
        style={{
          flexShrink: 0,
          marginTop: 2,
        }}
      />

      <span
        style={{
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}