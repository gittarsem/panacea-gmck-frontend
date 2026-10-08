import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "wouter";

import { useAuth } from "../context/AuthContext";
import {
  brCardApi,
  BrCardResponse,
} from "../api/brCardApi";

export default function MyCards() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [card, setCard] =
    useState<BrCardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadCard() {
      try {
        setLoading(true);
        setError("");

        const data =
          await brCardApi.getMyBrCard();

        if (!data) {
          setCard(null);
          return;
        }

        setCard(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your BR Card."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [user]);

  /*
   * LOGIN
   */
  if (!user) {
    return (
      <section>
        <div className="mono">MY CARD</div>

        <h1
          className="display"
          style={{
            marginTop: 18,
            fontSize: "clamp(58px, 7vw, 96px)",
            lineHeight: 0.9,
          }}
        >
          BR CARD
        </h1>

        <p
          style={{
            marginTop: 25,
            fontSize: 17,
          }}
        >
          Login to view your PANACEA ’26 BR Card.
        </p>

        <button
          className="mono"
          onClick={() => navigate("/login")}
          style={{
            marginTop: 25,
            padding: "15px 22px",
            border: "1px solid #111",
            background: "#111",
            color: "#f5eddf",
            cursor: "pointer",
          }}
        >
          LOGIN
          <ArrowRight
            size={16}
            style={{
              marginLeft: 10,
              verticalAlign: "middle",
            }}
          />
        </button>
      </section>
    );
  }

  /*
   * LOADING
   */
  if (loading) {
    return (
      <section>
        <div className="mono">MY CARD</div>

        <h1
          className="display"
          style={{
            marginTop: 18,
            fontSize: "clamp(58px, 7vw, 96px)",
            lineHeight: 0.9,
          }}
        >
          BR CARD
        </h1>

        <div
          className="mono"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
          }}
        >
          <Loader2
            size={18}
            className="animate-spin"
          />
          LOADING CARD...
        </div>
      </section>
    );
  }

  /*
   * NO CARD
   */
  if (!card) {
    return (
      <section>
        <div className="mono">MY CARD</div>

        <h1
          className="display"
          style={{
            marginTop: 18,
            fontSize: "clamp(58px, 7vw, 96px)",
            lineHeight: 0.9,
          }}
        >
          BR CARD
        </h1>

        <p
          style={{
            marginTop: 25,
            fontSize: 17,
          }}
        >
          You don't have a BR Card yet.
        </p>

        <button
          className="mono"
          onClick={() => navigate("/br-card")}
          style={{
            marginTop: 25,
            padding: "15px 22px",
            border: "1px solid #111",
            background: "#111",
            color: "#f5eddf",
            cursor: "pointer",
          }}
        >
          GET BR CARD
          <ArrowRight
            size={16}
            style={{
              marginLeft: 10,
              verticalAlign: "middle",
            }}
          />
        </button>
      </section>
    );
  }

  /*
   * PENDING / REJECTED
   */
  if (card.status !== "ACTIVE") {
    return (
      <section>
        <div className="mono">MY CARD</div>

        <h1
          className="display"
          style={{
            marginTop: 18,
            fontSize: "clamp(58px, 7vw, 96px)",
            lineHeight: 0.9,
          }}
        >
          BR CARD
        </h1>

        <div
          style={{
            maxWidth: 650,
            marginTop: 35,
            padding: 30,
            border: "1px solid #111",
            boxShadow: "8px 8px 0 #111",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 12,
              marginBottom: 15,
            }}
          >
            STATUS
          </div>

          <h2
            className="display"
            style={{
              margin: 0,
              fontSize: 52,
              lineHeight: 0.9,
            }}
          >
            {card.status === "PAYMENT_PENDING"
              ? "PAYMENT PENDING"
              : "PAYMENT REJECTED"}
          </h2>

          {card.rejectionReason && (
            <p
              style={{
                marginTop: 20,
                lineHeight: 1.6,
              }}
            >
              {card.rejectionReason}
            </p>
          )}

          <button
            className="mono"
            onClick={() =>
              navigate("/br-card/status")
            }
            style={{
              marginTop: 25,
              padding: "15px 20px",
              border: "1px solid #111",
              background: "#111",
              color: "#f5eddf",
              cursor: "pointer",
            }}
          >
            VIEW STATUS
          </button>
        </div>
      </section>
    );
  }

  const withAccommodation =
    card.passType === "WITH_ACCOMMODATION";

  /*
   * ACTIVE CARD
   */
  return (
    <section>
      {/* HEADER */}
      <div
        style={{
          paddingBottom: 40,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          MY CARD
        </div>

        <h1
          className="display"
          style={{
            margin: 0,
            fontSize: "clamp(58px, 7vw, 96px)",
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
          }}
        >
          BR CARD
        </h1>

        <p
          style={{
            marginTop: 24,
            fontSize: 17,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          Your official PANACEA ’26 BR Card.
          Keep this QR code ready for entry.
        </p>
      </div>

      {/* CARD + INFORMATION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 50,
        }}
      >
        {/* CARD */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 440,
            minHeight: 650,
            background: "#ff4f83",
            border: "1px solid #111",
            boxShadow: "12px 12px 0 #111",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* BLUE RING */}
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              border: "10px solid #29a9d0",
              top: -270,
              right: -180,
              pointerEvents: "none",
            }}
          />

          {/* YELLOW RING */}
          <div
            style={{
              position: "absolute",
              width: 450,
              height: 450,
              borderRadius: "50%",
              border: "10px solid #f5b719",
              top: -235,
              right: -145,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "72px 40px 40px",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 15,
                letterSpacing: "0.12em",
              }}
            >
              PANACEA ’26
            </div>

            <h2
              className="display"
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(58px, 9vw, 82px)",
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
              }}
            >
              BR
              <br />
              CARD
            </h2>

            <div
              className="mono"
              style={{
                marginTop: 26,
                fontSize: 15,
              }}
            >
              28–31 OCTOBER 2026
            </div>

            {/* QR */}
            <div
              style={{
                marginTop: 28,
                width: 190,
                height: 190,
                background: "#f5eddf",
                border: "1px solid #111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.qrToken && (
                <QRCodeSVG
                  value={card.qrToken}
                  size={168}
                  level="M"
                  includeMargin
                  bgColor="#f5eddf"
                  fgColor="#111111"
                />
              )}
            </div>

            <div
              className="mono"
              style={{
                marginTop: 24,
                fontSize: 11,
              }}
            >
              CARD ID
            </div>

            <div
              className="mono"
              style={{
                marginTop: 5,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {card.cardId}
            </div>

            <div
              className="mono"
              style={{
                marginTop: 12,
                fontSize: 11,
              }}
            >
              {withAccommodation
                ? "WITH ACCOMMODATION"
                : "WITHOUT ACCOMMODATION"}
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              marginBottom: 18,
            }}
          >
            CARD INFORMATION
          </div>

          <div
            style={{
              borderTop: "1px solid #111",
            }}
          >
            <InfoRow
              label="PASS"
              value={
                withAccommodation
                  ? "With Accommodation"
                  : "Without Accommodation"
              }
            />

            <InfoRow
              label="AMOUNT"
              value={`₹${Number(
                card.amount
              ).toLocaleString("en-IN")}`}
            />

            <InfoRow
              label="VALIDITY"
              value="28–31 October 2026"
            />

            <InfoRow
              label="STATUS"
              value="ACTIVE"
            />
          </div>

          {!withAccommodation && (
            <button
              className="mono"
              onClick={() =>
                navigate("/br-card/upgrade")
              }
              style={{
                width: "100%",
                marginTop: 30,
                padding: "16px 18px",
                border: "1px solid #111",
                background: "#111",
                color: "#f5eddf",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              UPGRADE TO ACCOMMODATION

              <ArrowRight
                size={16}
                style={{
                  float: "right",
                }}
              />
            </button>
          )}

          <button
            className="mono"
            onClick={() =>
              navigate("/br-card/status")
            }
            style={{
              width: "100%",
              marginTop: 12,
              padding: "16px 18px",
              border: "1px solid #111",
              background: "transparent",
              color: "#111",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            VIEW PAYMENT STATUS

            <ArrowRight
              size={16}
              style={{
                float: "right",
              }}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 20,
        padding: "18px 0",
        borderBottom: "1px solid #111",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 15,
        }}
      >
        {value}
      </div>
    </div>
  );
}