import {
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { useState } from "react";
import { Link, useLocation } from "wouter";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
    const [mobileOpen, setMobileOpen] =
        useState(false);

    const [, navigate] = useLocation();

    const {
        user,
        logout,
    } = useAuth();

    const handleLogout = async () => {
        setMobileOpen(false);

        await logout();

        navigate("/login");
    };

    const closeMobile = () => {
        setMobileOpen(false);
    };

    return (
        <header className="topbar">

            {/* =================================================
                BRAND
            ================================================= */}

            <Link
                href="/"
                className="brand"
                onClick={closeMobile}
            >
                PANACEA
                <small>
                    ’26 · GMC KATHUA
                </small>
            </Link>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav className="navlinks">

                <Link href="/">
                    HOME
                </Link>

                <Link href="/schedule">
                    SCHEDULE
                </Link>

                <Link href="/br-card">
                    BR CARD
                </Link>

                <Link href="/profile">
                    PROFILE
                </Link>

            </nav>


            {/* =================================================
                DESKTOP ACTIONS

                Theme + logout are hidden on mobile.
                Mobile version exists inside mobile-panel.
            ================================================= */}

            <div className="nav-actions">

                {/* Desktop theme */}
                <div className="desktop-theme">
                    <ThemeToggle />
                </div>

                {/* Desktop logout */}
                {user ? (
                    <button
                        type="button"
                        className="header-logout desktop-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={15} />

                        <span>
                            LOGOUT
                        </span>
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="button desktop-login"
                    >
                        LOGIN
                    </Link>
                )}

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="mobile-toggle"
                    aria-label={
                        mobileOpen
                            ? "Close menu"
                            : "Open menu"
                    }
                    aria-expanded={mobileOpen}
                    onClick={() =>
                        setMobileOpen(
                            (value) => !value
                        )
                    }
                >
                    {mobileOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>

            </div>


            {/* =================================================
                MOBILE MENU
            ================================================= */}

            {mobileOpen && (
                <div className="mobile-panel">

                    <Link
                        href="/"
                        onClick={closeMobile}
                    >
                        HOME
                    </Link>

                    <Link
                        href="/schedule"
                        onClick={closeMobile}
                    >
                        SCHEDULE
                    </Link>

                    <Link
                        href="/br-card"
                        onClick={closeMobile}
                    >
                        BR CARD
                    </Link>

                    <Link
                        href="/profile"
                        onClick={closeMobile}
                    >
                        PROFILE
                    </Link>


                    {/* =========================================
                        MOBILE ACTIONS
                    ========================================= */}

                    <div className="mobile-theme">

                        <ThemeToggle />

                        {user ? (
                            <button
                                type="button"
                                className="header-logout mobile-logout"
                                onClick={handleLogout}
                            >
                                <LogOut size={15} />

                                <span>
                                    LOGOUT
                                </span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="button mobile-login"
                                onClick={closeMobile}
                            >
                                LOGIN
                            </Link>
                        )}

                    </div>

                </div>
            )}

        </header>
    );
}