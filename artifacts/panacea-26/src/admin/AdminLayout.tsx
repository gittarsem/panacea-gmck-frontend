import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
    children: ReactNode;
}

const adminNavItems = [
    {
        label: "Dashboard",
        path: "/admin",
    },
    {
        label: "BR Cards",
        path: "/admin/br-cards",
    },
    {
        label: "Payments",
        path: "/admin/payments",
    },
    {
        label: "Scanner",
        path: "/admin/scanner",
    },
    {
        label: "Admins",
        path: "/admin/admins",
    },
    {
        label: "Settings",
        path: "/admin/settings",
    },
];

export default function AdminLayout({
    children,
}: AdminLayoutProps) {
    const [location, setLocation] = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        setLocation("/login");
    };

    return (
        <>
            <style>
                {`
                    .admin-shell {
                        width: 100%;
                        min-height: 100vh;
                        background: #F6F1E7;
                        color: #24211D;
                        box-sizing: border-box;
                    }

                    .admin-body {
                        width: 100%;
                        min-height: 100vh;
                        display: flex;
                        align-items: stretch;
                    }

                    .admin-sidebar {
                        width: 264px;
                        min-width: 264px;
                        background: #E9E0D1;
                        border-right: 1px solid #D8CCBA;
                        display: flex;
                        flex-direction: column;
                        padding: 28px 16px 20px;
                        box-sizing: border-box;
                        flex-shrink: 0;
                    }

                    .admin-sidebar-brand {
                        padding: 0 14px 27px;
                        border-bottom: 1px solid #D4C7B4;
                        flex-shrink: 0;
                    }

                    .admin-sidebar-eyebrow {
                        font-size: 11px;
                        font-weight: 900;
                        letter-spacing: 0.16em;
                        color: #9A7135;
                    }

                    .admin-sidebar-title {
                        margin-top: 10px;
                        font-size: 27px;
                        font-weight: 900;
                        line-height: 1;
                        letter-spacing: -0.045em;
                        color: #24211D;
                    }

                    .admin-sidebar-title.accent {
                        margin-top: 4px;
                        color: #9A7135;
                    }

                    .admin-sidebar-location {
                        margin-top: 12px;
                        font-size: 10px;
                        color: #847A6C;
                        font-weight: 700;
                        letter-spacing: 0.12em;
                    }

                    .admin-sidebar-nav {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        margin-top: 25px;
                    }

                    .admin-sidebar-link {
                        text-decoration: none;
                        color: #625B52;
                        background: transparent;
                        border: 1px solid transparent;
                        padding: 13px 15px;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 700;
                        display: block;
                        white-space: nowrap;
                        box-sizing: border-box;
                        transition:
                            background 0.2s ease,
                            border-color 0.2s ease,
                            color 0.2s ease;
                    }

                    .admin-sidebar-link:hover {
                        background: #F2E9D9;
                    }

                    .admin-sidebar-link.active {
                        color: #8A642E;
                        background: #F7E5B8;
                        border-color: #E1C57E;
                        font-weight: 900;
                    }

                    .admin-sidebar-account {
                        margin-top: auto;
                        border-top: 1px solid #D4C7B4;
                        padding: 20px 12px 0;
                    }

                    .admin-account-label {
                        font-size: 9px;
                        color: #938778;
                        letter-spacing: 0.14em;
                        margin-bottom: 7px;
                        font-weight: 800;
                    }

                    .admin-account-name {
                        font-size: 13px;
                        font-weight: 900;
                        color: #2A2621;
                    }

                    .admin-account-email {
                        margin-top: 4px;
                        font-size: 10px;
                        color: #857B6E;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .admin-logout {
                        width: 100%;
                        margin-top: 17px;
                        padding: 10px 13px;
                        border: 1px solid #CFC1AD;
                        background: #F4ECE0;
                        color: #62584C;
                        border-radius: 7px;
                        font-size: 10px;
                        font-weight: 900;
                        letter-spacing: 0.1em;
                        cursor: pointer;
                        text-align: left;
                        box-sizing: border-box;
                    }

                    .admin-main {
                        flex: 1 1 auto;
                        min-width: 0;
                        min-height: 100vh;
                        background: #F6F1E7;
                    }

                    .admin-main-content {
                        width: 100%;
                        max-width: 1600px;
                        margin: 0 auto;
                        padding: 34px 40px 80px;
                        min-width: 0;
                        box-sizing: border-box;
                    }

                    @media (max-width: 1100px) {
                        .admin-sidebar {
                            width: 220px;
                            min-width: 220px;
                        }

                        .admin-main-content {
                            padding: 30px 26px 70px;
                        }
                    }

                    @media (max-width: 800px) {
                        .admin-body {
                            display: block;
                            min-height: 0;
                        }

                        .admin-sidebar {
                            width: 100%;
                            min-width: 0;
                            min-height: 0;
                            padding: 14px 16px;
                            border-right: 0;
                            border-bottom: 1px solid #D8CCBA;
                        }

                        .admin-sidebar-brand {
                            display: none;
                        }

                        .admin-sidebar-nav {
                            flex-direction: row;
                            margin: 0;
                            gap: 8px;
                            overflow-x: auto;
                            overflow-y: hidden;
                            scrollbar-width: none;
                            padding-bottom: 1px;
                        }

                        .admin-sidebar-nav::-webkit-scrollbar {
                            display: none;
                        }

                        .admin-sidebar-link {
                            flex-shrink: 0;
                            padding: 10px 14px;
                        }

                        .admin-sidebar-account {
                            display: none;
                        }

                        .admin-main {
                            width: 100%;
                            min-height: 0;
                        }

                        .admin-main-content {
                            width: 100%;
                            max-width: none;
                            min-height: 0;
                            padding: 26px 20px 60px;
                        }
                    }

                    @media (max-width: 600px) {
                        .admin-main-content {
                            padding: 22px 14px 60px;
                        }

                        .admin-sidebar {
                            padding: 10px 12px;
                        }

                        .admin-sidebar-link {
                            font-size: 11px;
                            padding: 9px 12px;
                        }
                    }
                `}
            </style>

            <div className="admin-shell">
                <div className="admin-body">
                    <aside className="admin-sidebar">
                        <div className="admin-sidebar-brand">
                            <div className="admin-sidebar-eyebrow">
                                PANACEA 2026
                            </div>

                            <div className="admin-sidebar-title">
                                CONTROL
                            </div>

                            <div className="admin-sidebar-title accent">
                                PANEL
                            </div>

                            <div className="admin-sidebar-location">
                                GMC KATHUA
                            </div>
                        </div>

                        <nav className="admin-sidebar-nav">
                            {adminNavItems.map((item) => {
                                const isActive =
                                    item.path === "/admin"
                                        ? location === "/admin"
                                        : location.startsWith(item.path);

                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`admin-sidebar-link ${
                                            isActive ? "active" : ""
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="admin-sidebar-account">
                            <div className="admin-account-label">
                                SIGNED IN AS
                            </div>

                            <div className="admin-account-name">
                                {user?.fullName || "ADMIN"}
                            </div>

                            <div className="admin-account-email">
                                {user?.email || ""}
                            </div>

                            <button
                                type="button"
                                className="admin-logout"
                                onClick={handleLogout}
                            >
                                LOG OUT
                            </button>
                        </div>
                    </aside>

                    <main className="admin-main">
                        <div className="admin-main-content">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}