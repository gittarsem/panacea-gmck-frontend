import {
  type ReactNode,
  type CSSProperties,
} from "react";

export const adminColors = {
  page: "#F6EEDC",
  panel: "#FBF4E5",
  panelAlt: "#EFE4CE",

  black: "#111111",
  text: "#111111",
  muted: "#4B463E",

  pink: "#FF4B83",
  blue: "#2EA9D3",
  yellow: "#F9B91A",

  border: "#111111",
  borderSoft: "#D7C8AE",

  gold: "#F9B91A",
  goldLight: "#FFE08A",

  green: "#8CBF73",
  greenLight: "#DDEDCF",

  red: "#FF6B61",
  redLight: "#FFDCD8",

  blueLight: "#D7F0F8",
};

const brutalShadow = "6px 6px 0 #111111";

interface AdminPageProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function AdminPage({
  eyebrow,
  title,
  description,
  action,
  children,
}: AdminPageProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1500,
        margin: "0 auto",
        padding: "clamp(24px, 4vw, 54px)",
        boxSizing: "border-box",
        background: adminColors.page,
        minHeight: "100%",
        color: adminColors.black,
      }}
    >
      {/* TOP ACCENT */}
      <div
        style={{
          height: 8,
          width: "100%",
          background: adminColors.pink,
          border: `2px solid ${adminColors.black}`,
          boxSizing: "border-box",
          marginBottom: "clamp(28px, 5vw, 60px)",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 30,
          marginBottom: 40,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: "1 1 600px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: adminColors.black,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
          >
            {eyebrow}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(42px, 6vw, 78px)",
              lineHeight: 0.9,
              fontWeight: 950,
              letterSpacing: "-0.065em",
              color: adminColors.black,
              textTransform: "uppercase",
              maxWidth: 950,
              wordBreak: "break-word",
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              style={{
                margin: "22px 0 0",
                color: adminColors.muted,
                fontSize: "clamp(14px, 1.4vw, 17px)",
                lineHeight: 1.55,
                maxWidth: 700,
                fontWeight: 500,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {action && (
          <div
            style={{
              flex: "0 0 auto",
            }}
          >
            {action}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

interface AdminPanelProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function AdminPanel({
  children,
  style,
}: AdminPanelProps) {
  return (
    <div
      style={{
        background: adminColors.panel,
        border: `3px solid ${adminColors.black}`,
        borderRadius: 0,
        boxShadow: brutalShadow,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface AdminButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: AdminButtonProps) {
  const styles = {
    primary: {
      background: adminColors.pink,
      color: adminColors.black,
    },

    secondary: {
      background: adminColors.blue,
      color: adminColors.black,
    },

    danger: {
      background: adminColors.red,
      color: adminColors.black,
    },
  };

  const selected = styles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: 46,
        padding: "12px 20px",

        borderRadius: 0,
        border: `3px solid ${adminColors.black}`,

        background: selected.background,
        color: selected.color,

        fontSize: 11,
        fontWeight: 950,
        letterSpacing: "0.08em",
        textTransform: "uppercase",

        cursor: disabled ? "not-allowed" : "pointer",

        opacity: disabled ? 0.5 : 1,

        boxShadow: disabled
          ? "none"
          : "4px 4px 0 #111111",

        transition:
          "transform 120ms ease, box-shadow 120ms ease",

        whiteSpace: "nowrap",
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform =
            "translate(3px, 3px)";
          e.currentTarget.style.boxShadow =
            "1px 1px 0 #111111";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform =
            "translate(0, 0)";
          e.currentTarget.style.boxShadow =
            "4px 4px 0 #111111";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform =
            "translate(0, 0)";
          e.currentTarget.style.boxShadow =
            "4px 4px 0 #111111";
        }
      }}
    >
      {children}
    </button>
  );
}

interface AdminStatProps {
  label: string;
  value: string | number;
  accent?: "gold" | "green" | "red" | "blue";
}

export function AdminStat({
  label,
  value,
  accent = "gold",
}: AdminStatProps) {
  const accentColors = {
    gold: {
      background: adminColors.yellow,
      stripe: adminColors.black,
    },

    green: {
      background: adminColors.green,
      stripe: adminColors.black,
    },

    red: {
      background: adminColors.red,
      stripe: adminColors.black,
    },

    blue: {
      background: adminColors.blue,
      stripe: adminColors.black,
    },
  };

  const selected = accentColors[accent];

  return (
    <AdminPanel
      style={{
        padding: 0,
        minHeight: 150,
        position: "relative",
        overflow: "hidden",
        background: selected.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* TOP STRIPE */}
      <div
        style={{
          height: 9,
          width: "100%",
          background: selected.stripe,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          padding: "20px 22px 22px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: adminColors.black,
            fontWeight: 950,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: "clamp(38px, 4vw, 54px)",
            lineHeight: 0.9,
            fontWeight: 950,
            letterSpacing: "-0.065em",
            color: adminColors.black,
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </AdminPanel>
  );
}

export function AdminLoading() {
  return (
    <AdminPanel
      style={{
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: adminColors.yellow,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: adminColors.black,
          fontWeight: 950,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
      >
        LOADING...
      </div>
    </AdminPanel>
  );
}

export function AdminEmpty({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminPanel
      style={{
        padding: "clamp(35px, 6vw, 70px)",
        textAlign: "center",
        background: adminColors.panelAlt,
        color: adminColors.black,
        fontSize: 14,
        lineHeight: 1.5,
        fontWeight: 700,
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 950,
          letterSpacing: "-0.05em",
          marginBottom: 12,
        }}
      >
        NOTHING HERE.
      </div>

      <div
        style={{
          color: adminColors.muted,
        }}
      >
        {children}
      </div>
    </AdminPanel>
  );
}