import { useState } from "react";
import { useLocation } from "wouter";

import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  if (!user) {
    return (
      <section>
        <div
          className="mono"
          style={{
            fontSize: 12,
            marginBottom: 18,
          }}
        >
          SETTINGS
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
          ACCOUNT
        </h1>

        <p
          style={{
            marginTop: 28,
            fontSize: 17,
          }}
        >
          Please login to manage your account.
        </p>

        <button
          type="button"
          className="mono"
          onClick={() => navigate("/login")}
          style={{
            marginTop: 25,
            padding: "15px 25px",
            border: "1px solid #111",
            background: "#111",
            color: "#f5eddf",
            cursor: "pointer",
          }}
        >
          LOGIN
        </button>
      </section>
    );
  }

  return (
    <section>
      <div
        className="mono"
        style={{
          fontSize: 12,
          marginBottom: 18,
        }}
      >
        SETTINGS
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
        ACCOUNT
      </h1>

      <p
        style={{
          maxWidth: 650,
          marginTop: 28,
          fontSize: 17,
          lineHeight: 1.6,
        }}
      >
        Manage your PANACEA ’26 account information.
      </p>

      {/* ACCOUNT INFORMATION */}
      <div
        style={{
          marginTop: 45,
          maxWidth: 850,
          border: "1px solid #111",
          boxShadow: "8px 8px 0 #111",
        }}
      >
        <div
          className="mono"
          style={{
            padding: "22px 28px",
            borderBottom: "1px solid #111",
            fontSize: 12,
          }}
        >
          ACCOUNT INFORMATION
        </div>

        <SettingRow
          label="FULL NAME"
          value={user.fullName}
        />

        <SettingRow
          label="EMAIL"
          value={user.email}
        />

        <SettingRow
          label="PHONE"
          value={user.phoneNumber}
        />

        <SettingRow
          label="COLLEGE"
          value={user.collegeName}
        />

        <SettingRow
          label="LOCATION"
          value={`${user.city}, ${user.state}`}
          last
        />
      </div>

      {/* SECURITY */}
      <div
        style={{
          marginTop: 45,
          maxWidth: 850,
          border: "1px solid #111",
        }}
      >
        <div
          className="mono"
          style={{
            padding: "22px 28px",
            borderBottom: "1px solid #111",
            fontSize: 12,
          }}
        >
          SECURITY
        </div>

        <div
          style={{
            padding: 28,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Password
          </div>

          <p
            style={{
              marginTop: 8,
              marginBottom: 20,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Your account password is securely stored and
            cannot be displayed here.
          </p>

          <button
            type="button"
            className="mono"
            onClick={() => navigate("/login")}
            style={{
              padding: "13px 18px",
              border: "1px solid #111",
              background: "transparent",
              color: "#111",
              cursor: "pointer",
            }}
          >
            PASSWORD OPTIONS
          </button>
        </div>
      </div>

      {/* LOGOUT */}
      <div
        style={{
          marginTop: 45,
          maxWidth: 850,
          padding: 28,
          border: "1px solid #111",
          background: "#ff4f83",
          boxShadow: "7px 7px 0 #111",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
          }}
        >
          ACCOUNT ACTION
        </div>

        <h2
          className="display"
          style={{
            marginTop: 14,
            fontSize: 42,
            lineHeight: 0.95,
          }}
        >
          LOG OUT
        </h2>

        <p
          style={{
            marginTop: 12,
            maxWidth: 550,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Sign out of your PANACEA ’26 account on this
          device.
        </p>

        <button
          type="button"
          className="mono"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            marginTop: 22,
            padding: "14px 22px",
            border: "1px solid #111",
            background: "#111",
            color: "#f5eddf",
            cursor: loggingOut
              ? "not-allowed"
              : "pointer",
            opacity: loggingOut ? 0.6 : 1,
          }}
        >
          {loggingOut ? "LOGGING OUT..." : "LOG OUT"}
        </button>
      </div>
    </section>
  );
}

function SettingRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 25,
        padding: "22px 28px",
        borderBottom: last
          ? "none"
          : "1px solid #111",
        alignItems: "center",
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
        {value || "—"}
      </div>
    </div>
  );
}