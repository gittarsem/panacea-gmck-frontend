import {
  type ReactNode,
} from "react";

export const adminColors = {
  page: "#F6F1E7",
  panel: "#FBF8F1",
  panelAlt: "#EFE7D8",
  border: "#DED4C3",
  borderDark: "#CFC2AE",
  text: "#28241F",
  muted: "#82786B",
  gold: "#B7893D",
  goldLight: "#F2DFB2",
  green: "#789B68",
  greenLight: "#E5EEDC",
  red: "#B76B61",
  redLight: "#F3E1DD",
  blue: "#6E8FA3",
  blueLight: "#E2EBF0",
};

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
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: adminColors.gold,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>

          <h1
            style={{
              margin: "7px 0 0",
              fontSize: 38,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: "-0.055em",
              color: adminColors.text,
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              style={{
                margin: "10px 0 0",
                color: adminColors.muted,
                fontSize: 14,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

interface AdminPanelProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export function AdminPanel({
  children,
  style,
}: AdminPanelProps) {
  return (
    <div
      style={{
        background: adminColors.panel,
        border: `1px solid ${adminColors.border}`,
        borderRadius: 3,
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
      background: adminColors.gold,
      color: "#FFFFFF",
      border: adminColors.gold,
    },
    secondary: {
      background: adminColors.panelAlt,
      color: adminColors.text,
      border: adminColors.borderDark,
    },
    danger: {
      background: adminColors.redLight,
      color: adminColors.red,
      border: "#E1BDB7",
    },
  };

  const selected = styles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 17px",
        borderRadius: 5,
        border: `1px solid ${selected.border}`,
        background: selected.background,
        color: selected.color,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.06em",
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled ? 0.5 : 1,
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
    gold: adminColors.gold,
    green: adminColors.green,
    red: adminColors.red,
    blue: adminColors.blue,
  };

  return (
    <AdminPanel
      style={{
        padding: 22,
        minHeight: 128,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 5,
          height: "100%",
          background: accentColors[accent],
        }}
      />

      <div
        style={{
          fontSize: 10,
          color: adminColors.muted,
          fontWeight: 900,
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 19,
          fontSize: 42,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "-0.06em",
          color: adminColors.text,
        }}
      >
        {value}
      </div>
    </AdminPanel>
  );
}

export function AdminLoading() {
  return (
    <div
      style={{
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: adminColors.muted,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.12em",
      }}
    >
      LOADING...
    </div>
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
        padding: 50,
        textAlign: "center",
        color: adminColors.muted,
        fontSize: 13,
      }}
    >
      {children}
    </AdminPanel>
  );
}