import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "panacea_theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") {
        return "light";
    }

    const saved =
        localStorage.getItem(THEME_KEY);

    if (
        saved === "light" ||
        saved === "dark"
    ) {
        return saved;
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}

function applyTheme(theme: Theme) {
    const root =
        document.documentElement;

    root.classList.toggle(
        "dark",
        theme === "dark"
    );

    root.dataset.theme = theme;

    document.body.dataset.theme =
        theme;

    localStorage.setItem(
        THEME_KEY,
        theme
    );
}

export default function ThemeToggle() {
    const [theme, setTheme] =
        useState<Theme>(
            getInitialTheme
        );

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) =>
            current === "light"
                ? "dark"
                : "light"
        );
    };

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            className="header-theme-toggle"
            onClick={toggleTheme}
            aria-label={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            title={
                isDark
                    ? "Light mode"
                    : "Dark mode"
            }
        >
            {isDark ? (
                <Sun size={17} strokeWidth={2} />
            ) : (
                <Moon size={17} strokeWidth={2} />
            )}

            <span>
                {isDark
                    ? "LIGHT"
                    : "DARK"}
            </span>
        </button>
    );
}