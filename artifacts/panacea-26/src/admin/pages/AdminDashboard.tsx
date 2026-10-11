import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "wouter";

import {
  adminApi,
  type AdminDashboardResponse,
} from "@/api/adminApi";

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "#FFFDF8",
        border: "1px solid #D8CCBA",
        borderRadius: 10,
        minHeight: 145,
        padding: 24,
        boxShadow:
          "0 8px 24px rgba(72, 55, 30, 0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          color: "#847A6C",
          textTransform: "uppercase",
          fontWeight: 800,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 46,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: accent
            ? "#9A7135"
            : "#24211D",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ControlCard({
  eyebrow,
  title,
  description,
  value,
  path,
}: {
  eyebrow: string;
  title: string;
  description: string;
  value: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          background: "#FBF6ED",
          border: "1px solid #D8CCBA",
          borderRadius: 10,
          minHeight: 190,
          padding: 26,
          boxShadow:
            "0 8px 24px rgba(72, 55, 30, 0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          transition:
            "transform 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              color: "#9A7135",
              fontSize: 10,
              letterSpacing: "0.13em",
              marginBottom: 16,
              fontWeight: 900,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              color: "#24211D",
              fontSize: 25,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: "#6F665A",
              fontSize: 14,
              lineHeight: 1.55,
              marginTop: 12,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #E1D7C7",
          }}
        >
          <span
            className="mono"
            style={{
              color: "#805C2A",
              fontSize: 10,
              letterSpacing: "0.08em",
              fontWeight: 900,
            }}
          >
            {value}
          </span>

          <span
            style={{
              color: "#9A7135",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

const EMPTY_DASHBOARD: AdminDashboardResponse = {
  totalBrCards: 0,
  pendingPayments: 0,
  activeBrCards: 0,
  rejectedPayments: 0
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] =
    useState<AdminDashboardResponse>(
      EMPTY_DASHBOARD
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const data =
          await adminApi.getDashboard();

        if (mounted) {
          setDashboard(data);
        }
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 1450,
        paddingBottom: 60,
      }}
    >
      <section
        style={{
          marginBottom: 48,
        }}
      >
        <div
          className="mono"
          style={{
            color: "#9A7135",
            fontSize: 10,
            letterSpacing: "0.14em",
            marginBottom: 14,
            fontWeight: 900,
          }}
        >
          PANACEA 2026 / CONTROL PANEL
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#24211D",
                fontSize:
                  "clamp(42px, 6vw, 72px)",
                lineHeight: 0.92,
                fontWeight: 900,
                letterSpacing: "-0.06em",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: "18px 0 0",
                color: "#6F665A",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              PANACEA administration,
              BR Cards and entry control.
            </p>
          </div>

          <div
            style={{
              background: "#EFE1C4",
              border: "1px solid #DCC596",
              borderRadius: 9,
              padding: "13px 18px",
            }}
          >
            <div
              className="mono"
              style={{
                color: "#805C2A",
                fontSize: 9,
                letterSpacing: "0.1em",
                fontWeight: 900,
              }}
            >
              SYSTEM STATUS
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: 900,
                color: "#4F412F",
              }}
            >
              <span
                style={{
                  color: "#8DAD67",
                  marginRight: 6,
                }}
              >
                ●
              </span>
              ADMIN ACCESS ACTIVE
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          marginBottom: 52,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "#625B52",
              fontWeight: 900,
            }}
          >
            BR CARD OVERVIEW
          </div>

          <div
            style={{
              height: 1,
              flex: 1,
              background: "#D8CCBA",
            }}
          />

          {loading && (
            <div
              className="mono"
              style={{
                fontSize: 9,
                color: "#9A7135",
                letterSpacing: "0.08em",
              }}
            >
              LOADING
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 18,
          }}
        >
          <StatCard
            label="Total BR Cards"
            value={dashboard.totalBrCards}
          />

          <StatCard
            label="Active BR Cards"
            value={dashboard.activeBrCards}
          />

          <StatCard
            label="Pending Payments"
            value={dashboard.pendingPayments}
            accent
          />

          <StatCard
            label="Rejected Payments"
            value={dashboard.rejectedPayments}
          />
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "#625B52",
              fontWeight: 900,
            }}
          >
            QUICK CONTROL
          </div>

          <div
            style={{
              height: 1,
              flex: 1,
              background: "#D8CCBA",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 20,
          }}
        >
          <ControlCard
            eyebrow="01 / PAYMENTS"
            title="Payment Queue"
            description="Review submitted BR Card payments and approve or reject transactions."
            value={
              dashboard.pendingPayments > 0
                ? `${dashboard.pendingPayments} PENDING`
                : "ALL CLEAR"
            }
            path="/admin/payments"
          />

          <ControlCard
            eyebrow="02 / BR CARDS"
            title="BR Card Management"
            description="View BR Card activity and inspect the current card and payment state."
            value={`${dashboard.activeBrCards} ACTIVE`}
            path="/admin/br-cards"
          />

          <ControlCard
            eyebrow="03 / ENTRY"
            title="Card Scanner"
            description="Verify a visitor's secure BR Card QR token at the festival entry point."
            value="READY"
            path="/admin/scanner"
          />

          <ControlCard
            eyebrow="04 / SYSTEM"
            title="Festival Settings"
            description="Manage the core PANACEA festival information displayed across the platform."
            value="CONFIGURE"
            path="/admin/settings"
          />
        </div>
      </section>

      <section
        style={{
          marginTop: 48,
          background: "#E9E0D1",
          border: "1px solid #D8CCBA",
          borderRadius: 10,
          padding: "22px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              color: "#9A7135",
              fontSize: 9,
              letterSpacing: "0.12em",
              marginBottom: 7,
              fontWeight: 900,
            }}
          >
            PANACEA 2026
          </div>

          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: "#29251F",
            }}
          >
            FOUR DAYS. ONE VIBE. INFINITE MEMORIES.
          </div>
        </div>

        <div
          className="mono"
          style={{
            color: "#847A6C",
            fontSize: 9,
            letterSpacing: "0.08em",
          }}
        >
          GMC KATHUA
        </div>
      </section>
    </div>
  );
}