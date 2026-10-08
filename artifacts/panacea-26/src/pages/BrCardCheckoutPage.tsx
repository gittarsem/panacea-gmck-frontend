import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageTitle from "@/components/PageTitle";
type PassType =
  | "without_accommodation"
  | "with_accommodation";

export default function BrCardCheckoutPage() {
  const { user } = useAuth();
  const [, setLoc] = useLocation();

  const params = new URLSearchParams(
    window.location.search
  );

  const type =
    params.get("type") === "with_accommodation"
      ? "with_accommodation"
      : "without_accommodation";

  const price =
    type === "with_accommodation" ? 1500 : 1000;

  const passName =
    type === "with_accommodation"
      ? "BR Card + Accommodation"
      : "BR Card — Without Accommodation";

  if (!user) {
    return (
      <main className="shell">
        <PageTitle
          tag="BR Card"
          title="LOGIN REQUIRED."
          sub="Please login to continue with your BR Card registration."
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

  return (
    <main className="shell">
      {/* BACK */}
      <button
        type="button"
        onClick={() => setLoc("/br-card")}
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
        <span className="mono">BACK TO BR CARD</span>
      </button>

      <PageTitle
        tag="BR Card Registration"
        title="CONFIRM."
        sub="Review your details before proceeding to payment."
      />

      <div
        className="two-col"
        style={{
          paddingBottom: 90,
        }}
      >
        {/* =========================
            USER DETAILS
        ========================== */}
        <section>
          <div
            className="mono"
            style={{
              marginBottom: 18,
            }}
          >
            YOUR DETAILS
          </div>

          <div
            style={{
              borderTop: "1px solid var(--ink)",
            }}
          >
            <DetailRow
              label="FULL NAME"
              value={user.fullName}
            />

            <DetailRow
              label="EMAIL"
              value={user.email}
            />

            <DetailRow
              label="PHONE"
              value={user.phoneNumber}
            />

            <DetailRow
              label="COLLEGE"
              value={user.collegeName}
            />

            <DetailRow
              label="CITY"
              value={user.city}
            />

            <DetailRow
              label="STATE"
              value={user.state}
            />
          </div>

          <div
            className="notice"
            style={{
              marginTop: 24,
            }}
          >
            <strong>CHECK YOUR DETAILS</strong>

            <p style={{ marginTop: 8 }}>
              These details will be associated with
              your BR Card registration. Make sure
              everything is correct before continuing.
            </p>

            <button
              type="button"
              onClick={() => setLoc("/profile")}
              style={{
                marginTop: 8,
                background: "none",
                border: "none",
                padding: 0,
                textDecoration: "underline",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              EDIT PROFILE
            </button>
          </div>
        </section>

        {/* =========================
            ORDER SUMMARY
        ========================== */}
        <section>
          <div
            className="mono"
            style={{
              marginBottom: 18,
            }}
          >
            ORDER SUMMARY
          </div>

          <div
            style={{
              border: "1px solid var(--ink)",
            }}
          >
            <div
              style={{
                padding: 22,
                borderBottom:
                  "1px solid var(--ink)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  marginBottom: 10,
                }}
              >
                PANACEA ’26
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 25,
                }}
              >
                {passName}
              </h3>
            </div>

            <div
              style={{
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span>BR Card</span>

                <strong>
                  ₹{price.toLocaleString("en-IN")}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 18,
                  borderTop:
                    "1px solid var(--ink)",
                  fontSize: 20,
                }}
              >
                <strong>TOTAL</strong>

                <strong>
                  ₹{price.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          {/* VALIDITY */}
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 12,
            }}
          >
            <SummaryItem
              label="VALIDITY"
              value="28–31 October 2026"
            />

            <SummaryItem
              label="VENUE"
              value="Government Medical College Kathua"
            />

            <SummaryItem
              label="ACCOMMODATION"
              value={
                type === "with_accommodation"
                  ? "Included"
                  : "Not Included"
              }
            />
          </div>

          {/* CTA */}
          <button
            className="button"
            style={{
              marginTop: 28,
            }}
            onClick={() =>
              setLoc(
                `/br-card/payment?type=${type}`
              )
            }
          >
            PROCEED TO PAYMENT
            <ArrowRight size={15} />
          </button>
        </section>
      </div>
    </main>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

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
        display: "grid",
        gridTemplateColumns:
          "140px 1fr",
        gap: 20,
        padding: "17px 0",
        borderBottom:
          "1px solid var(--ink)",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 10,
        }}
      >
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

function SummaryItem({
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
        paddingBottom: 12,
        borderBottom:
          "1px solid var(--ink)",
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 10,
        }}
      >
        {label}
      </span>

      <span
        style={{
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}