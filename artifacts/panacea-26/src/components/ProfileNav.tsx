import { useLocation } from "wouter";

export type ProfileSection =
  | "overview"
  | "schedule"
  | "cards"
  | "settings";

interface ProfileNavProps {
  section: ProfileSection;
  onChange: (section: ProfileSection) => void;
}

export default function ProfileNav({
  section,
  onChange,
}: ProfileNavProps) {
  const [, navigate] = useLocation();

  const items: {
    label: string;
    section: ProfileSection;
  }[] = [
    {
      label: "OVERVIEW",
      section: "overview",
    },
    {
      label: "MY SCHEDULE",
      section: "schedule",
    },
    {
      label: "MY CARDS",
      section: "cards",
    },
    {
      label: "SETTINGS",
      section: "settings",
    },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 45,
      }}
    >
      {items.map((item) => {
        const active = section === item.section;

        return (
          <button
            key={item.section}
            type="button"
            onClick={() => {
              onChange(item.section);

              // Keep profile as the only route.
              if (window.location.pathname !== "/profile") {
                navigate("/profile");
              }
            }}
            className="mono"
            style={{
              padding: "15px 30px",

              // Use the current theme text color
              // instead of hardcoded #111.
              border: "1px solid currentColor",

              background: active ? "#111" : "transparent",

              // Active tab keeps the cream text.
              // Inactive tab inherits the current theme color.
              color: active ? "#f5eddf" : "inherit",

              cursor: "pointer",
              fontSize: 12,
              letterSpacing: "0.04em",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}