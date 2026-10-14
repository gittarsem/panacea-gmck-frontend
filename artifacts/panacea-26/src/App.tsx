import {
    type ReactNode,
    type FormEvent,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import BrCardPage from "./pages/BrCardPage";
import BrCardUpgradePage from "./pages/BrCardUpgradePage";
import TechGeeksPage from "./pages/TechGeeksPage";
import PanaceaHeroArt from "./components/PanaceaHeroArt";
import PanaceaNightsPage from "./pages/PanaceaNightsPage";
import AboutPage from "./pages/AboutPage";
import { Moon, Sun } from "lucide-react";
import { savedEventsApi } from "./api/savedEventsApi";
import { ShoppingCart } from "lucide-react";
import {
    saveEvent,
    isEventSaved,
} from "@/utils/savedEvents";


import {
    Route,
    Switch,
    Link,
    useLocation,
    useParams,
    useSearch,
    Router as WouterRouter,
} from "wouter";

import {
    ArrowDownRight,
    ArrowRight,
    CalendarDays,
    ChevronDown,
    CircleUserRound,
    Eye,
    EyeOff,
    LogOut,
    MapPin,
    Menu,
    Search,
    Ticket,
    X,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import {
    events,
    categories,
    days,
    organizers,
    culturalOrganizers,
    sportsOrganizers,
    academicOrganizers,
    type EventItem,
} from "./data";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import BrCardCheckoutPage from "./pages/BrCardCheckoutPage";
import BrCardPaymentPage from "./pages/BrCardPaymentPage";
import BrCardStatusPage from "./pages/BrCardStatusPage";

import ProfileHome from "./pages/ProfileHome";
import SavedPage from "./pages/SavedPage";
import SettingsPage from "./pages/SettingsPage";
import MyCards from "./pages/MyCards";

import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./admin/AdminLayout";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminBrCards from "./admin/pages/AdminBrCards";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminScanner from "./admin/pages/AdminScanner";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminManagement from "./admin/pages/AdminManagement";
/* =========================================================
   DEMO / FESTIVAL STATE
   ========================================================= */

type Demo = {
    registrations: string[];
    saved: string[];
    cards: string[];
};

type DemoContextType = {
    demo: Demo;
    setDemo: (d: Demo) => void;
    notice: string;
    flash: (s: string) => void;
};

const DemoContext = createContext<DemoContextType | null>(null);

const queryClient = new QueryClient();

const readDemo = (): Demo => {
    try {
        const saved = JSON.parse(
            localStorage.getItem("panacea-demo") || "null"
        );

        return (
            saved || {
                registrations: [],
                saved: [],
                cards: [],
            }
        );
    } catch {
        return {
            registrations: [],
            saved: [],
            cards: [],
        };
    }
};

function useDemo() {
    const value = useContext(DemoContext);

    if (!value) {
        throw new Error("Demo context missing");
    }

    return value;
}

/* =========================================================
   APP
   ========================================================= */
const COLLEGES = [
    "Govt. Medical College Jammu",
    "Govt. Medical College Anantnag",
    "Govt. Medical College Udhampur",
    "ASCOMS Jammu",
    "AIIMS Jammu",
    "IIT Jammu",
    "IIM Jammu",
    "Govt. Medical College Rajouri",
    "Govt. Medical College Srinagar",
    "SKIMS",
    "Govt. Medical College Baramulla",
    "Govt. Medical College Doda",
];

const STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
];

function App() {
    const [demo, setDemoState] = useState<Demo>(readDemo);
    const [notice, setNotice] = useState("");

    const setDemo = (d: Demo) => {
        setDemoState(d);

        localStorage.setItem(
            "panacea-demo",
            JSON.stringify(d)
        );
    };

    const flash = (message: string) => {
        setNotice(message);

        window.setTimeout(() => {
            setNotice("");
        }, 3200);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <DemoContext.Provider
                        value={{
                            demo,
                            setDemo,
                            notice,
                            flash,
                        }}
                    >
                        <WouterRouter
                            base={import.meta.env.BASE_URL.replace(/\/$/, "")}
                        >
                            <ScrollToTop />

                            <Router />
                        </WouterRouter>

                        {notice && (
                            <div
                                className="toast-note"
                                role="status"
                            >
                                {notice}

                                <button
                                    aria-label="Dismiss notification"
                                    onClick={() =>
                                        setNotice("")
                                    }
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <Toaster />
                    </DemoContext.Provider>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

function ScrollToTop() {
    const [location] = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }, [location]);

    return null;
}

/* =========================================================
   ROUTER
   ========================================================= */

function Router() {
    const [location] = useLocation();

    const isAdminRoute =
        location === "/admin" ||
        location.startsWith("/admin/");

    return (
        <ErrorBoundary resetKey={location}>
            <Layout />

            <Switch>
                <Route path="/" component={Home} />
                <Route path="/events" component={EventsPage} />
                <Route path="/events/:id" component={EventDetail} />
                <Route path="/schedule" component={SchedulePage} />
                <Route path="/panacea-nights" component={PanaceaNightsPage} />
                <Route path="/br-card" component={BrCardPage} />
                <Route path="/about" component={AboutPage} />
                <Route
                    path="/login"
                    component={() => <AuthPage mode="login" />}
                />
                <Route
                    path="/signup"
                    component={() => <AuthPage mode="signup" />}
                />
                <Route path="/profile" component={ProfileHome} />
                <Route
                    path="/br-card/checkout"
                    component={BrCardCheckoutPage}
                />
                <Route
                    path="/br-card/payment"
                    component={BrCardPaymentPage}
                />
                <Route
                    path="/br-card/status"
                    component={BrCardStatusPage}
                />

                <Route path="/tech-geeks" component={TechGeeksPage} />

                <Route
                    path="/admin"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />

                <Route
                    path="/admin/br-cards"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminBrCards />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />

                <Route
                    path="/admin/payments"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminPayments />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />

                <Route
                    path="/admin/scanner"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminScanner />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />
                <Route
                    path="/admin/admins"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminManagement />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />

                <Route
                    path="/admin/settings"
                    component={() => (
                        <AdminGuard>
                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>
                        </AdminGuard>
                    )}
                />

                <Route
                    path="/br-card/upgrade"
                    component={BrCardUpgradePage}
                />

                <Route component={NotFound} />
            </Switch>

            {!isAdminRoute && <Footer />}
        </ErrorBoundary>
    );
}
/* =========================================================
   HEADER
   ========================================================= */

function Layout() {
    const [open, setOpen] = useState(false);

    const {
        user,
        logout,
    } = useAuth();

    const [loc] = useLocation();

    const links = [
        ["Home", "/"],
        ["Events", "/events"],
        ["Schedule", "/schedule"],
        ["PANACEA Nights", "/panacea-nights"],
        ["BR Card", "/br-card"],
        ["About", "/about"],
    ];

    const isAdmin =
        user &&
        Array.isArray(user.roles) &&
        user.roles.some(
            (role: string) =>
                role === "ROLE_ADMIN" ||
                role === "ADMIN"
        );

    const handleLogout = async () => {
        setOpen(false);

        try {
            await logout();
        } finally {
            window.location.href = "/";
        }
    };

    return (
        <header className="topbar">

            {/* =================================================
                BRAND
            ================================================= */}
            <Link
                className="brand"
                href="/"
                aria-label="PANACEA 26 home"
            >
                PANACEA ’26

                <small>
                    GMC KATHUA · 28—31 OCT
                </small>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}
            <nav
                className="navlinks"
                aria-label="Main navigation"
            >
                {links.map(([name, href]) => (
                    <Link
                        key={href}
                        className={
                            loc === href
                                ? "active"
                                : ""
                        }
                        href={href}
                    >
                        {name.toUpperCase()}
                    </Link>
                ))}
            </nav>

            {/* =================================================
                HEADER ACTIONS
            ================================================= */}
            <div className="nav-actions">

                <div className="desktop-admin-actions">

                    {/* ADMIN */}
                    {isAdmin && (
                        <Link
                            className="button ink admin-nav-button"
                            href="/admin"
                        >
                            ADMIN DASHBOARD
                        </Link>
                    )}

                    {/* ACCOUNT */}
                    <Link
                        className="button ink desktop-account-button"
                        href={
                            user
                                ? "/profile"
                                : "/login"
                        }
                    >
                        {user ? (
                            <>
                                <CircleUserRound
                                    size={15}
                                />

                                {user.fullName
                                    .split(" ")[0]
                                    .toUpperCase()}
                            </>
                        ) : (
                            "LOGIN / SIGN UP"
                        )}
                    </Link>

                    {/* LOGOUT */}
                    {user && (
                        <button
                            type="button"
                            className="header-logout"
                            onClick={
                                handleLogout
                            }
                            aria-label="Logout"
                            title="Logout"
                        >
                            <LogOut
                                size={15}
                            />

                            <span>
                                LOGOUT
                            </span>
                        </button>
                    )}

                    {/* THEME */}
                    <ThemeToggle />

                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    className="mobile-toggle"
                    aria-label={
                        open
                            ? "Close menu"
                            : "Open menu"
                    }
                    aria-expanded={open}
                    onClick={() =>
                        setOpen(
                            (value) =>
                                !value
                        )
                    }
                >
                    {open ? (
                        <X />
                    ) : (
                        <Menu />
                    )}
                </button>
            </div>

            {/* =================================================
                MOBILE MENU
            ================================================= */}
            {open && (
                <nav
                    className="mobile-panel"
                    aria-label="Mobile navigation"
                >
                    {links.map(
                        ([name, href]) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                {name.toUpperCase()}
                            </Link>
                        )
                    )}

                    <Link
                        href={
                            user
                                ? "/profile"
                                : "/login"
                        }
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        {user
                            ? "MY PANACEA"
                            : "LOGIN / SIGN UP"}
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={() =>
                                setOpen(false)
                            }
                        >
                            ADMIN DASHBOARD
                        </Link>
                    )}

                    {/* MOBILE THEME + LOGOUT */}
                    <div className="mobile-theme">

                        <ThemeToggle />

                        {user && (
                            <button
                                type="button"
                                className="header-logout mobile-logout"
                                onClick={
                                    handleLogout
                                }
                            >
                                <LogOut
                                    size={15}
                                />

                                <span>
                                    LOGOUT
                                </span>
                            </button>
                        )}

                    </div>
                </nav>
            )}
        </header>
    );
}

/* =========================================================
   FOOTER
   ========================================================= */

function Footer() {
    return (
        <footer className="panacea-footer">
            <style>{`
                .panacea-footer{background:#0d0c0c;color:#f3ebd8;border-top:6px solid #ff4f83;margin-top:0}
                .panacea-footer a{color:inherit;text-decoration:none}
                .panacea-footer-cta{padding:92px 0 96px;border-bottom:1px solid rgba(243,235,216,.2)}
                .panacea-footer-cta-inner{display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:end}
                .panacea-footer-kicker{font-size:12px;letter-spacing:.16em;margin-bottom:24px}
                .panacea-footer-title{margin:0;font:clamp(58px,7vw,112px) 'Archivo Black';line-height:.84;letter-spacing:-.055em}
                .panacea-footer-cta-right{max-width:520px}
                .panacea-footer-cta-right p{margin:0 0 28px;font-size:17px;line-height:1.6;color:rgba(243,235,216,.84)}
                .panacea-footer-actions{display:flex;gap:12px;flex-wrap:wrap}
                .panacea-footer-main{display:grid;grid-template-columns:1.45fr .85fr .85fr 1fr;gap:55px;padding-top:70px;padding-bottom:70px}
                .panacea-footer-brand{display:flex;flex-direction:column;align-items:flex-start}
                .panacea-footer-logo{display:inline-flex;align-items:baseline;gap:6px;padding:10px 15px;background:#ff4f83;color:#11100f!important;border:2px solid #f3ebd8;box-shadow:5px 5px 0 #f3ebd8;margin-bottom:23px}
                .panacea-footer-logo strong{font:29px 'Archivo Black';letter-spacing:-.06em}
                .panacea-footer-logo span{font:17px 'Archivo Black'}
                .panacea-footer-brand-info{display:flex;flex-direction:column;gap:8px}
                .panacea-footer-brand-info .mono{font-size:9px;letter-spacing:.13em;color:rgba(243,235,216,.65)}
                .panacea-footer-brand-info p{margin:0;font-size:16px;line-height:1.4}
                .panacea-footer-column{display:flex;flex-direction:column;align-items:flex-start;gap:13px}
                .panacea-footer-column h3{margin:0 0 8px;font:14px 'DM Mono';text-transform:uppercase;letter-spacing:.13em}
                .panacea-footer-column a{font:13px 'DM Sans';color:rgba(243,235,216,.82);transition:color .18s,transform .18s}
                .panacea-footer-column a:hover{color:#ff4f83;transform:translateX(4px)}
                .panacea-footer-contact p{margin:0 0 4px;font-size:13px;line-height:1.55;color:rgba(243,235,216,.78)}
                .panacea-footer-instagram{margin-top:7px;padding:10px 13px;border:2px solid rgba(243,235,216,.3)!important;font:10px 'DM Mono'!important;letter-spacing:.08em}
                .panacea-footer-instagram:hover{background:#ff4f83;color:#11100f!important;border-color:#ff4f83!important;transform:none!important}
                .panacea-footer-bottom{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;min-height:76px;border-top:1px solid rgba(243,235,216,.2);font:10px 'DM Mono';letter-spacing:.07em}
                .panacea-footer-copy{color:rgba(243,235,216,.72)}
                .panacea-footer-bottom-links{display:flex;gap:20px;justify-content:center;flex-wrap:wrap}
                .panacea-footer-bottom-links a{color:rgba(243,235,216,.7)}
                .panacea-footer-bottom-links a:hover{color:#ff4f83}
                .panacea-footer-credit{justify-self:end;color:#f3ebd8;text-decoration:underline;text-underline-offset:5px;font-weight:700}
                .panacea-footer-credit span{display:inline-block;margin-left:5px;transition:transform .18s}
                .panacea-footer-credit:hover{color:#ff4f83}
                .panacea-footer-credit:hover span{transform:translateX(5px)}
                @media(max-width:900px){
                    .panacea-footer-cta-inner{grid-template-columns:1fr;gap:40px}
                    .panacea-footer-main{grid-template-columns:1fr 1fr;gap:45px 30px}
                    .panacea-footer-brand{grid-column:1/-1}
                    .panacea-footer-bottom{grid-template-columns:1fr;justify-items:start;padding:24px 0}
                    .panacea-footer-bottom-links{justify-content:flex-start}
                    .panacea-footer-credit{justify-self:start}
                }
                @media(max-width:600px){
                    .panacea-footer-cta{padding:65px 0 70px}
                    .panacea-footer-title{font-size:clamp(48px,15vw,76px)}
                    .panacea-footer-cta-right p{font-size:15px}
                    .panacea-footer-main{grid-template-columns:1fr;padding-top:55px;padding-bottom:55px}
                    .panacea-footer-brand{grid-column:auto}
                }
            `}</style>

            <section className="panacea-footer-main shell">
                <div className="panacea-footer-brand">
                    <Link
                        href="/"
                        className="panacea-footer-logo"
                    >
                        <strong>PANACEA</strong>
                        <span>’26</span>
                    </Link>

                    <div className="panacea-footer-brand-info">
                        <span className="mono">
                            GOVERNMENT MEDICAL COLLEGE, KATHUA
                        </span>

                        <p>
                            Culture · Chaos · Crescendo
                        </p>

                        <p>
                            28—31 October 2026
                        </p>
                    </div>

                    <span className="sticker">
                        FOUR DAYS. COUNTLESS MEMORIES.
                    </span>
                </div>

                <nav className="panacea-footer-column">
                    <h3 className="mono">
                        EXPLORE
                    </h3>

                    <Link href="/about">
                        About PANACEA
                    </Link>

                    <Link href="/events">
                        Events
                    </Link>

                    <Link href="/schedule">
                        Schedule
                    </Link>

                    <Link href="/br-card">
                        BR Card
                    </Link>
                </nav>

                <nav className="panacea-footer-column">
                    <h3 className="mono">
                        FESTIVAL
                    </h3>

                    <Link href="/events?category=Cultural"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        Cultural
                    </Link>

                    <Link href="/events?category=Sports"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        Sports
                    </Link>

                    <Link href="/events?category=Academic"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        Academic
                    </Link>

                    <Link href="/events?category=Pro+Shows"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        Pro Shows
                    </Link>

                    <Link href="/panacea-nights"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                        PANACEA Nights
                    </Link>
                </nav>

                <div className="panacea-footer-column panacea-footer-contact">
                    <h3 className="mono">
                        CONTACT
                    </h3>

                    <p>
                        Government Medical College,
                        <br />
                        Kathua, Jammu & Kashmir
                    </p>

                    <a href="tel:9682391837">
                        Aryeen Sharma
                        <br />
                        9682391837
                    </a>

                    <a href="tel:9797454951">
                        Faizan Malik
                        <br />
                        9797454951
                    </a>

                    <a
                        href="https://instagram.com/panacea.gmck"
                        target="_blank"
                        rel="noreferrer"
                        className="panacea-footer-instagram"
                    >
                        @PANACEA.GMCK →
                    </a>
                </div>
            </section>

            <div className="panacea-footer-bottom shell">
                <div className="panacea-footer-copy">
                    © 2026 PANACEA · GMC KATHUA
                </div>

                <nav className="panacea-footer-bottom-links">
                    <Link href="/events">
                        EVENTS
                    </Link>

                    <Link href="/schedule">
                        SCHEDULE
                    </Link>

                    <Link href="/br-card">
                        BR CARD
                    </Link>

                    <Link href="/about">
                        ABOUT
                    </Link>


                </nav>

                <Link
                    href="/tech-geeks"
                    className="panacea-footer-credit"
                >
                    MADE BY TECH GEEKS <span>→</span>
                </Link>
            </div>
        </footer>
    );
}

/* =========================================================
   HOME
   ========================================================= */

function Home() {
    const picks = events.filter((event) =>
        [
            "edm-night",
            "mun",
            "cricket",
            "dance",
            "qawali",
            "surgical-workshop",
        ].includes(event.id)
    );

    return (
        <>
            <section className="hero">
                <div className="hero-copy">
                    <div className="eyebrow">
                        Government Medical College · Kathua presents
                    </div>

                    <h1 className="hero-title display">
                        PANACEA
                        <em>’26</em>
                    </h1>

                    <div className="sticker">
                        CULTURE · CHAOS · CRESCENDO
                    </div>

                    <p className="hero-meta">
                        FOUR DAYS OF MEDICINE, MOVEMENT
                        <br />
                        AND VERY GOOD NOISE.
                        <br />
                        28 — 31 OCTOBER 2026
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <Link
                            className="button"
                            href="/events"
                        >
                            EXPLORE EVENTS
                            <ArrowRight size={15} />
                        </Link>

                        <Link
                            className="button paper"
                            href="/br-card"
                        >
                            Buy BR CARD
                            <ShoppingCart size={15} />
                        </Link>
                    </div>
                </div>

                <PanaceaHeroArt />
            </section>

            <div className="ticker">
                <span>
                    {Array.from(
                        { length: 4 },
                        () =>
                            "PANACEA ’26 ★ 28—31 OCTOBER ★ GMC KATHUA ★ CULTURE · CHAOS · CRESCENDO ★　　"
                    ).join("")}
                </span>
            </div>

            <section className="section">
                <div className="shell">
                    <div className="section-head">
                        <div>
                            <div className="eyebrow">
                                One festival, many frequencies
                            </div>

                            <h2 className="section-title">
                                PICK YOUR
                                <br />
                                KIND OF CHAOS.
                            </h2>
                        </div>

                        <p className="section-intro">
                            A four-day gathering for the stage
                            people, the scoreboard people, the
                            curious minds and everyone who wants
                            to stay for the encore. Event dates,
                            timings, venues and fees are being
                            confirmed.
                        </p>
                    </div>

                    <div className="category-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={`/events?category=${encodeURIComponent(
                                    category.name
                                )}`}
                                className={`category ${category.tone}`}
                            >
                                <span style={{ fontSize: 32 }}>
                                    {category.icon}
                                </span>

                                <h3>{category.name}</h3>

                                <p>{category.desc}</p>

                                <span className="mono">
                                    EXPLORE EVENTS ↗
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section dark">
                <div className="shell two-col">
                    <div>
                        <div className="eyebrow">
                            Mark your calendar
                        </div>

                        <h2 className="section-title">
                            THE LONG
                            <br />
                            WEEKEND.
                        </h2>

                        <p
                            style={{
                                lineHeight: 1.8,
                                maxWidth: 410,
                            }}
                        >
                            28 to 31 October 2026. Four festival
                            days at Government Medical College,
                            Kathua. Individual event schedule
                            and venue details: TBA.
                        </p>

                        <Link
                            className="button"
                            href="/schedule"
                        >
                            OPEN THE FOUR-DAY GRID
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div>
                        <div className="sticker">
                            PANACEA BEGINS IN
                        </div>

                        <Countdown />

                        <p
                            className="mono"
                            style={{
                                fontSize: 10,
                                marginTop: 17,
                            }}
                        >
                            COUNTING DOWN TO 28 OCTOBER 2026 ·
                            00:00 IST
                        </p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="section-head">
                        <div>
                            <div className="eyebrow">
                                A first look
                            </div>

                            <h2 className="section-title">
                                POSTERS IN
                                <br />
                                THE MAKING.
                            </h2>
                        </div>

                        <Link
                            className="button paper"
                            href="/events"
                        >
                            ALL EVENTS
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="event-grid">
                        {picks.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                tone={
                                    [
                                        "pink",
                                        "blue",
                                        "yellow",
                                        "cream",
                                        "dark-card",
                                        "blue",
                                    ][index]
                                }
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="shell two-col">
                    <div>
                        <div className="eyebrow">
                            News from the noticeboard
                        </div>

                        <h2 className="section-title">
                            THE PINNED
                            <br />
                            NOTE.
                        </h2>
                    </div>

                    <div className="paper-panel">
                        <span className="pill">
                            OFFICIAL · PANACEA ’26
                        </span>

                        <h3
                            className="display"
                            style={{ fontSize: 28 }}
                        >
                            The dates are locked.
                        </h3>

                        <p
                            style={{
                                lineHeight: 1.7,
                            }}
                        >
                            <strong>PANACEA ’26</strong> takes over Government Medical
                            College, Kathua from <strong>28—31 October 2026</strong>.
                            Four days. One campus. Endless memories.
                            <br />
                            <br />
                            From sports and academics to cultural events, competitions,
                            music, and everything in between — the countdown is officially on.
                            <br />
                            <br />
                            <strong>BR Card registrations are now open.</strong>
                            Grab your card, get your crew together, and get ready for
                            four days of PANACEA ’26.
                        </p>

                        <p
                            className="mono"
                            style={{ fontSize: 10 }}
                        >
                            UPDATED · 14 OCTOBER 2026 · COUNTDOWN BEGINS
                        </p>
                    </div>
                </div>
            </section>

            <section className="section dark">
                <div className="shell section-head">
                    <div>
                        <div className="eyebrow">
                            Your fest, your pass
                        </div>

                        <h2 className="section-title">
                            GET IN THE
                            <br />
                            PICTURE.
                        </h2>
                    </div>

                    <div>
                        <p
                            style={{
                                maxWidth: 420,
                                lineHeight: 1.7,
                            }}
                        >
                            Create your PANACEA account to manage
                            your profile, registrations and passes.
                        </p>

                        <Link
                            className="button"
                            href="/signup"
                        >
                            CREATE ACCOUNT
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

/* =========================================================
   COUNTDOWN
   ========================================================= */

function Countdown() {
    const get = () =>
        Math.max(
            0,
            new Date(
                "2026-10-28T00:00:00+05:30"
            ).getTime() - Date.now()
        );

    const [time, setTime] = useState(get);

    useEffect(() => {
        const timer = window.setInterval(
            () => setTime(get()),
            1000
        );

        return () =>
            window.clearInterval(timer);
    }, []);

    const secs = Math.floor(time / 1000);

    return (
        <div className="countdown">
            {[
                ["DAYS", Math.floor(secs / 86400)],
                [
                    "HRS",
                    Math.floor(
                        (secs % 86400) / 3600
                    ),
                ],
                [
                    "MIN",
                    Math.floor(
                        (secs % 3600) / 60
                    ),
                ],
                ["SEC", secs % 60],
            ].map(([name, value]) => (
                <div
                    className="count-unit"
                    key={name}
                >
                    <strong>
                        {String(value).padStart(2, "0")}
                    </strong>

                    <span
                        className="mono"
                        style={{ fontSize: 9 }}
                    >
                        {name}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   EVENT CARD
   ========================================================= */

function EventCard({
    event,
    tone = "cream",
}: {
    event: EventItem;
    tone?: string;
}) {
    return (
        <article
            className={`event-card ${tone}`}
        >
            <div className="event-top">
                <span className="pill">
                    {event.category}
                </span>

                <span
                    className="mono"
                    style={{ fontSize: 9 }}
                >
                    {event.type}
                </span>
            </div>

            <div className="event-body">
                <h3>{event.name}</h3>

                <p
                    style={{
                        fontSize: 13,
                        lineHeight: 1.55,
                    }}
                >
                    {event.description}
                </p>
            </div>

            <div className="event-footer">
                <span>{event.date}</span>

                <Link
                    href={`/events/${event.id}`}
                >
                    VIEW DETAILS
                    <ArrowRight size={13} />
                </Link>
            </div>
        </article>
    );
}

/* =========================================================
   PAGE TITLE
   ========================================================= */

function PageTitle({
    tag,
    title,
    sub,
}: {
    tag: string;
    title: string | ReactNode;
    sub?: string;
}) {
    const rendered =
        typeof title === "string"
            ? title
                .split(/<br\s*\/?>/i)
                .map((part, index) => (
                    <span
                        key={`${part}-${index}`}
                    >
                        {index > 0 && <br />}
                        {part}
                    </span>
                ))
            : title;

    return (
        <div className="page-intro">
            <div className="eyebrow">
                {tag}
            </div>

            <h1>{rendered}</h1>

            {sub && (
                <p
                    style={{
                        maxWidth: 640,
                        lineHeight: 1.7,
                    }}
                >
                    {sub}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   EVENTS
   ========================================================= */

function EventsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [date, setDate] = useState("All");
    const [type, setType] = useState("All");
    const [status, setStatus] = useState("All");

    const [loc] = useLocation();
    const searchParams = useSearch();

    const { demo } = useDemo();

    useEffect(() => {
        const categoryParam = new URLSearchParams(
            searchParams
        ).get("category");

        if (
            categoryParam &&
            categories.some(
                (item) => item.name === categoryParam
            )
        ) {
            setCategory(categoryParam);
        } else {
            setCategory("All");
        }
    }, [searchParams]);

    const filtered = useMemo(
        () =>
            events.filter(
                (event) =>
                    (category === "All" ||
                        event.category === category) &&
                    (!search ||
                        `${event.name} ${event.description} ${event.category}`
                            .toLowerCase()
                            .includes(search.toLowerCase())) &&
                    (date === "All" ||
                        event.date === date) &&
                    (type === "All" ||
                        event.type === type) &&
                    (status === "All" ||
                        (status === "Registered"
                            ? demo.registrations.includes(
                                event.id
                            )
                            : !demo.registrations.includes(
                                event.id
                            )))
            ),
        [
            category,
            search,
            date,
            type,
            status,
            demo.registrations,
        ]
    );

    return (
        <main className="shell">
            <PageTitle
                tag="The festival field guide / 01"
                title="EVENTS, IN<br/>FULL COLOUR."
                sub="Find your event by name or mood. Confirmed dates, times, venues, fees and eligibility will appear when organizers publish them."
            />

            <div className="filters">
                <label
                    style={{
                        position: "relative",
                        flex: "1 1 220px",
                    }}
                >
                    <Search
                        size={16}
                        style={{
                            position: "absolute",
                            left: 13,
                            top: 14,
                        }}
                    />

                    <input
                        className="field"
                        aria-label="Search events"
                        placeholder="SEARCH EVENTS"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        style={{
                            width: "100%",
                            paddingLeft: 39,
                        }}
                    />
                </label>

                <select
                    aria-label="Filter category"
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option>All</option>

                    {categories.map((category) => (
                        <option
                            key={category.name}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <select
                    aria-label="Filter date"
                    value={date}
                    onChange={(event) =>
                        setDate(event.target.value)
                    }
                >
                    <option>All</option>
                    <option>Date TBA</option>
                </select>

                <select
                    aria-label="Filter type"
                    value={type}
                    onChange={(event) =>
                        setType(event.target.value)
                    }
                >
                    <option>All</option>

                    {[
                        ...new Set(
                            events.map(
                                (event) => event.type
                            )
                        ),
                    ].map((eventType) => (
                        <option key={eventType}>
                            {eventType}
                        </option>
                    ))}
                </select>

                <select
                    aria-label="Filter registration status"
                    value={status}
                    onChange={(event) =>
                        setStatus(event.target.value)
                    }
                >
                    <option>All</option>
                    <option>Registered</option>
                    <option>Not registered</option>
                </select>
            </div>

            <p
                className="mono"
                style={{ fontSize: 10 }}
            >
                {filtered.length} EVENTS · EVENT DATES
                AND TIMES TBA
            </p>

            {filtered.length ? (
                <div
                    className="event-grid"
                    style={{
                        margin: "24px 0 85px",
                    }}
                >
                    {filtered.map(
                        (event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                tone={
                                    [
                                        "pink",
                                        "blue",
                                        "yellow",
                                        "cream",
                                        "dark-card",
                                    ][index % 5]
                                }
                            />
                        )
                    )}
                </div>
            ) : (
                <div
                    className="paper-panel"
                    style={{
                        margin: "25px 0 90px",
                    }}
                >
                    <h2 className="display">
                        NO POSTERS IN THIS PILE.
                    </h2>

                    <p>
                        Try a different search or filter.
                    </p>

                    <button
                        className="button"
                        onClick={() => {
                            setSearch("");
                            setCategory("All");
                            setDate("All");
                            setType("All");
                            setStatus("All");
                        }}
                    >
                        RESET FILTERS
                    </button>
                </div>
            )}
        </main>
    );
}

/* =========================================================
   EVENT DETAIL
   ========================================================= */
function EventDetail() {
    const { id } = useParams();

    const event = events.find(
        (event) => event.id === id
    );

    const { demo, setDemo } = useDemo();

    if (!event) {
        return (
            <main className="shell">
                <PageTitle
                    tag="404 / Missing poster"
                    title="EVENT NOT FOUND"
                />

                <Link
                    className="button"
                    href="/events"
                >
                    BACK TO EVENTS
                </Link>
            </main>
        );
    }

    const { flash } = useDemo();

    const [saved, setSaved] =
        useState(false);

    const [saving, setSaving] =
        useState(false);


    /* =========================================================
     * SAVE / REMOVE EVENT FROM PANACEA PROFILE
     *
     * IMPORTANT:
     * This function ONLY handles the PANACEA profile.
     *
     * It does NOT:
     * - download an ICS file
     * - open Google Calendar
     * - interact with device calendar
     * ========================================================= */

    const saveToProfile = async () => {
        if (saving) {
            return;
        }

        try {
            setSaving(true);

            /*
             * =====================================================
             * REMOVE EVENT FROM PROFILE
             * =====================================================
             */

            if (saved) {
                await savedEventsApi.remove(
                    event.id
                );

                setSaved(false);

                flash(
                    "Removed from your PANACEA schedule."
                );

                return;
            }


            /*
             * =====================================================
             * SAVE EVENT TO PROFILE
             * =====================================================
             */

            await savedEventsApi.save({
                eventId: event.id,
                name: event.name,
                category: event.category,
                type: event.type,
                date: event.date,
                time: event.time,
                venue: event.venue,
                description:
                    event.description,
            });


            setSaved(true);

            flash(
                "Event saved to your PANACEA schedule."
            );

        } catch (error: any) {

            console.error(
                "Unable to update PANACEA schedule:",
                error
            );

            flash(
                error?.message ||
                "Unable to update your PANACEA schedule."
            );

        } finally {

            setSaving(false);
        }
    };


    /* =========================================================
     * PARSE EVENT DATE + TIME
     *
     * Used ONLY by calendar functions.
     *
     * IMPORTANT:
     * This does NOT save anything to the PANACEA profile.
     * ========================================================= */

    const getCalendarDetails = () => {

        /*
         * Events without confirmed timing
         * cannot be added to calendars.
         */

        if (
            event.date.includes("TBA") ||
            event.time.includes("TBA")
        ) {
            return null;
        }


        /*
         * =====================================================
         * PARSE DATE
         * =====================================================
         */

        const normalizedDate =
            event.date
                .replace(/,/g, "")
                .replace(/-/g, " ")
                .trim();

        const dateMatch =
            normalizedDate.match(
                /^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?$/
            );


        if (!dateMatch) {
            return null;
        }


        const months: Record<
            string,
            number
        > = {

            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
        };


        const day =
            Number(dateMatch[1]);


        const monthKey =
            dateMatch[2]
                .slice(0, 3)
                .toLowerCase();


        const year =
            Number(
                dateMatch[3] ||
                "2026"
            );


        const month =
            months[monthKey];


        if (month === undefined) {
            return null;
        }


        /*
         * =====================================================
         * PARSE TIME
         * =====================================================
         */

        const timeMatch =
            event.time.match(
                /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i
            );


        let hours = 0;

        let minutes = 0;


        if (timeMatch) {

            hours =
                Number(
                    timeMatch[1]
                );

            minutes =
                Number(
                    timeMatch[2] ||
                    "0"
                );


            const meridiem =
                timeMatch[3].toUpperCase();


            if (
                meridiem === "PM" &&
                hours !== 12
            ) {
                hours += 12;
            }


            if (
                meridiem === "AM" &&
                hours === 12
            ) {
                hours = 0;
            }
        }


        /*
         * =====================================================
         * CREATE START / END
         * =====================================================
         */

        const start =
            new Date(
                year,
                month,
                day,
                hours,
                minutes
            );


        /*
         * Existing behavior:
         * Event duration = 90 minutes.
         */

        const end =
            new Date(
                start.getTime() +
                90 * 60 * 1000
            );


        return {
            start,
            end,
        };
    };


    /* =========================================================
     * GOOGLE CALENDAR
     *
     * Completely independent from profile saving.
     * ========================================================= */

    const addToGoogleCalendar = () => {

        try {

            const calendarDetails =
                getCalendarDetails();


            if (!calendarDetails) {

                flash(
                    "Calendar timing is still being confirmed for this event."
                );

                return;
            }


            const {
                start,
                end,
            } = calendarDetails;


            /*
             * Google Calendar requires:
             *
             * YYYYMMDDTHHMMSSZ
             */

            const formatGoogleDate =
                (value: Date) =>
                    value
                        .toISOString()
                        .replace(
                            /[-:]/g,
                            ""
                        )
                        .replace(
                            /\.\d{3}Z$/,
                            "Z"
                        );


            const params =
                new URLSearchParams({

                    action: "TEMPLATE",

                    text:
                        `PANACEA ’26 — ${event.name}`,

                    dates:
                        `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,

                    details:
                        event.description ||
                        "",

                    location:
                        event.venue ||
                        "",
                });


            const googleCalendarUrl =
                `https://calendar.google.com/calendar/render?${params.toString()}`;


            /*
             * Open Google Calendar in a new tab.
             */

            window.open(
                googleCalendarUrl,
                "_blank",
                "noopener,noreferrer"
            );


            flash(
                "Google Calendar opened."
            );

        } catch (error) {

            console.error(
                "Unable to open Google Calendar:",
                error
            );

            flash(
                "Unable to open Google Calendar."
            );
        }
    };


    /* =========================================================
     * DEVICE CALENDAR
     *
     * Creates an ICS file.
     *
     * Completely independent from:
     * - PANACEA profile
     * - Google Calendar
     * ========================================================= */

    const addToDeviceCalendar = () => {

        try {

            const calendarDetails =
                getCalendarDetails();


            if (!calendarDetails) {

                flash(
                    "Calendar timing is still being confirmed for this event."
                );

                return;
            }


            const {
                start,
                end,
            } = calendarDetails;


            /*
             * =====================================================
             * FORMAT ICS DATE
             * =====================================================
             */

            const calendarDate =
                (value: Date) =>
                    value
                        .toISOString()
                        .replace(
                            /[-:]/g,
                            ""
                        )
                        .replace(
                            /\.\d{3}Z$/,
                            "Z"
                        );


            /*
             * =====================================================
             * ESCAPE ICS TEXT
             * =====================================================
             */

            const escapeIcs =
                (value: string) =>
                    value
                        .replace(
                            /\\/g,
                            "\\\\"
                        )
                        .replace(
                            /;/g,
                            "\\;"
                        )
                        .replace(
                            /,/g,
                            "\\,"
                        )
                        .replace(
                            /\n/g,
                            "\\n"
                        );


            /*
             * =====================================================
             * CREATE ICS
             * =====================================================
             */

            const ics = [

                "BEGIN:VCALENDAR",

                "VERSION:2.0",

                "PRODID:-//PANACEA 2026//EN",

                "CALSCALE:GREGORIAN",

                "BEGIN:VEVENT",


                `UID:${event.id}-panacea-2026@gmckathua`,


                `DTSTAMP:${calendarDate(
                    new Date()
                )}`,


                `DTSTART:${calendarDate(
                    start
                )}`,


                `DTEND:${calendarDate(
                    end
                )}`,


                `SUMMARY:${escapeIcs(
                    `PANACEA ’26 — ${event.name}`
                )}`,


                `DESCRIPTION:${escapeIcs(
                    event.description ||
                    ""
                )}`,


                `LOCATION:${escapeIcs(
                    event.venue ||
                    ""
                )}`,


                "END:VEVENT",

                "END:VCALENDAR",

            ].join("\r\n");


            /*
             * =====================================================
             * DOWNLOAD ICS FILE
             * =====================================================
             */

            const blob =
                new Blob(
                    [ics],
                    {
                        type:
                            "text/calendar;charset=utf-8",
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const anchor =
                document.createElement(
                    "a"
                );


            anchor.href =
                url;


            anchor.download =
                `${event.id}-panacea-2026.ics`;


            document.body.appendChild(
                anchor
            );


            anchor.click();


            anchor.remove();


            URL.revokeObjectURL(
                url
            );


            flash(
                "Calendar file downloaded. Open it to add the event to your device calendar."
            );

        } catch (error) {

            console.error(
                "Unable to create calendar file:",
                error
            );

            flash(
                "Unable to create the calendar file."
            );
        }
    };


    /* =========================================================
     * UI
     * ========================================================= */

    return (
        <main className="shell">

            <div className="page-intro">

                <div className="eyebrow">

                    {event.category} / {event.type} /
                    PANACEA ’26

                </div>


                <h1>
                    {event.name}
                </h1>


                <p
                    style={{
                        maxWidth: 720,
                        fontSize: 18,
                        lineHeight: 1.6,
                    }}
                >
                    {event.description}
                </p>

            </div>


            <div
                className="two-col"
                style={{
                    paddingBottom: 90,
                    alignItems: "stretch",
                }}
            >

                <div
                    className={`pass-wrap ${event.category === "Sports"
                        ? "blue"
                        : event.category ===
                            "Academic"
                            ? "yellow"
                            : ""
                        }`}
                    style={{
                        maxWidth: "none",
                        minHeight: 420,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent:
                            "space-between",
                    }}
                >

                    <div>

                        <span className="mono">
                            PANACEA ’26 · EVENT FILE
                        </span>


                        <h2
                            style={{
                                fontSize:
                                    "clamp(42px, 5.5vw, 72px)",
                                lineHeight: 0.92,
                                marginTop: 55,
                                maxWidth: 560,
                                position:
                                    "relative",
                                zIndex: 1,
                            }}
                        >
                            {event.name}
                        </h2>


                        <div
                            className="checker"
                            style={{
                                marginTop: 45,
                                maxWidth: 430,
                            }}
                        />

                    </div>


                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            position:
                                "relative",
                            zIndex: 2,
                        }}
                    >

                        <ArrowDownRight
                            size={38}
                        />

                    </div>

                </div>


                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        justifyContent:
                            "center",
                    }}
                >

                    <h2
                        className="section-title"
                        style={{
                            fontSize: 40,
                            marginBottom: 20,
                        }}
                    >
                        THE
                        <br />
                        DETAILS.
                    </h2>


                    <Info
                        label="Date & time"
                        value={`${event.date} · ${event.time}`}
                    />


                    <Info
                        label="Venue"
                        value={event.venue}
                    />


                    {/* =================================================
                        ACTIONS
                       ================================================= */}

                    <div
                        style={{
                            marginTop: 28,
                            display: "flex",
                            flexDirection:
                                "column",
                            gap: 12,
                        }}
                    >

                        {/* =============================================
                            SAVE TO PANACEA PROFILE
                           ============================================= */}

                        <button
                            className="button paper"
                            onClick={
                                saveToProfile
                            }
                            disabled={saving}
                            type="button"
                            style={{
                                width: "100%",
                            }}
                        >

                            {saving
                                ? "SAVING..."
                                : saved
                                    ? "REMOVE FROM MY PROFILE"
                                    : "SAVE TO MY PROFILE"}

                            <CalendarDays
                                size={15}
                            />

                        </button>


                        {/* =============================================
                            EXTERNAL CALENDAR OPTIONS
                           ============================================= */}

                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: 10,
                            }}
                        >

                            <button
                                className="button"
                                onClick={
                                    addToDeviceCalendar
                                }
                                type="button"
                                style={{
                                    width:
                                        "100%",
                                    fontSize:
                                        13,
                                }}
                            >
                                DEVICE CALENDAR
                            </button>


                            <button
                                className="button"
                                onClick={
                                    addToGoogleCalendar
                                }
                                type="button"
                                style={{
                                    width:
                                        "100%",
                                    fontSize:
                                        13,
                                }}
                            >
                                GOOGLE CALENDAR
                            </button>

                        </div>


                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                lineHeight:
                                    1.5,
                                opacity:
                                    0.65,
                            }}
                        >
                            Save the event to your
                            PANACEA profile or add it
                            separately to your calendar.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}
/* =========================================================
   INFO
   ========================================================= */

function Info({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                borderBottom:
                    "1px solid var(--ink)",
                padding: "13px 0",
            }}
        >
            <div
                className="mono"
                style={{ fontSize: 9 }}
            >
                {label}
            </div>

            <div style={{ marginTop: 5 }}>
                {value}
            </div>
        </div>
    );
}


function SchedulePage() {
    const [day, setDay] = useState(0);

    const scheduleDays = [
        {
            date: "28 OCT",
            fullDate: "28 OCTOBER 2026",
            number: "01",
            events: [
                {
                    name: "Art Battle",
                    time: "12:00 PM",
                    venue: "Lecture Hall",
                    category: "Cultural",
                },
                {
                    name: "Dance Competition",
                    time: "5:00 PM",
                    venue: "Main Stage",
                    category: "Cultural",
                },
                {
                    name: "Surgical Skills Workshop",
                    time: "TBA",
                    venue: "Lecture Hall 1 & 2",
                    category: "Academic",
                },
                {
                    name: "Comedy Night",
                    time: "TBA",
                    venue: "Main Stage · GMC Kathua College Campus",
                    category: "Pro Shows",
                    headliner: true,
                },
            ],
        },
        {
            date: "29 OCT",
            fullDate: "29 OCTOBER 2026",
            number: "02",
            events: [
                {
                    name: "Singing Competition",
                    time: "6:00 PM",
                    venue: "Main Stage",
                    category: "Cultural",
                },
                {
                    name: "EDM Night",
                    time: "TBA",
                    venue: "Main Stage · GMC Kathua College Campus",
                    category: "Pro Shows",
                    headliner: true,
                },
            ],
        },
        {
            date: "30 OCT",
            fullDate: "30 OCTOBER 2026",
            number: "03",
            events: [
                {
                    name: "Treasure Hunt",
                    time: "1:00 PM",
                    venue: "College Campus",
                    category: "Cultural",
                },
                {
                    name: "Model United Nations",
                    time: "TBA",
                    venue: "Lecture Hall 1 & 2",
                    category: "Academic",
                },
                {
                    name: "Headliner Concert",
                    time: "TBA",
                    venue: "Main Stage · GMC Kathua College Campus",
                    category: "Pro Shows",
                    headliner: true,
                },
            ],
        },
        {
            date: "31 OCT",
            fullDate: "31 OCTOBER 2026",
            number: "04",
            events: [
                {
                    name: "The Unknown Files",
                    time: "12:30 PM",
                    venue: "Lecture Hall",
                    category: "Cultural",
                },
                {
                    name: "Skit & Drama",
                    time: "1:00 PM",
                    venue: "Lecture Hall",
                    category: "Cultural",
                },
                {
                    name: "Cooking Competition",
                    time: "1:00 PM",
                    venue: "College Campus",
                    category: "Cultural",
                },
                {
                    name: "Fashion Show",
                    time: "6:00 PM",
                    venue: "Main Stage",
                    category: "Cultural",
                },
                {
                    name: "Basic Life Support Workshop",
                    time: "TBA",
                    venue: "Lecture Hall 1 & 2",
                    category: "Academic",
                },
                {
                    name: "Qawali Night",
                    time: "TBA",
                    venue: "Main Stage · GMC Kathua College Campus",
                    category: "Pro Shows",
                    headliner: true,
                },
            ],
        },
    ];

    const sports = [
        {
            name: "Cricket",
            venue: "Cricket Ground",
        },
        {
            name: "Football",
            venue: "Football Ground",
        },
        {
            name: "Badminton",
            venue: "Badminton Court",
        },
        {
            name: "Basketball",
            venue: "Basketball Court",
        },
        {
            name: "Chess",
            venue: "Sports Area",
        },
        {
            name: "Table Tennis",
            venue: "Sports Area",
        },
    ];

    const selectedDay = scheduleDays[day];

    return (
        <main className="shell schedule-page">
            {/* HEADER */}

            <div className="schedule-heading">
                <div>
                    <div className="eyebrow">
                        PANACEA ’26 · GMC KATHUA
                    </div>

                    <h1 className="schedule-title display">
                        THE
                        <br />
                        SCHEDULE.
                    </h1>

                    <p className="schedule-intro">
                        Four days. One festival. A programme
                        of culture, competition, academics,
                        sports and unforgettable nights.
                    </p>
                </div>

                <div className="schedule-date-note">
                    <span className="mono">
                        FESTIVAL DATES
                    </span>

                    <strong>
                        28—31
                        <br />
                        OCTOBER
                        <br />
                        2026
                    </strong>
                </div>
            </div>

            {/* DAY SELECTOR */}

            <div
                className="schedule-day-selector"
                role="tablist"
                aria-label="Festival days"
            >
                {scheduleDays.map((item, index) => (
                    <button
                        key={item.date}
                        role="tab"
                        aria-selected={day === index}
                        className={
                            day === index
                                ? "schedule-day active"
                                : "schedule-day"
                        }
                        onClick={() => setDay(index)}
                    >
                        <span className="schedule-day-number">
                            DAY {item.number}
                        </span>

                        <strong>{item.date}</strong>
                    </button>
                ))}
            </div>

            {/* SELECTED DAY */}

            <section className="schedule-board">
                <div className="schedule-board-header">
                    <div>
                        <span className="mono">
                            DAY {selectedDay.number}
                        </span>

                        <h2>
                            {selectedDay.fullDate}
                        </h2>
                    </div>

                    <span className="schedule-board-label">
                        PROGRAMME
                    </span>
                </div>

                <div className="schedule-events">
                    {selectedDay.events.map((event) => (
                        <div
                            className={`schedule-event ${event.headliner
                                ? "schedule-event-headliner"
                                : ""
                                }`}
                            key={event.name}
                        >
                            <div className="schedule-event-time">
                                <span className="mono">
                                    TIME
                                </span>

                                <strong>
                                    {event.time}
                                </strong>
                            </div>

                            <div className="schedule-event-main">
                                <span
                                    className={`schedule-category schedule-category-${event.category
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {event.category}
                                </span>

                                <h3>{event.name}</h3>

                                <p>
                                    {event.venue}
                                </p>
                            </div>

                            {event.headliner && (
                                <div className="schedule-headliner-tag">
                                    PANACEA NIGHT
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* SPORTS */}

            <section className="schedule-sports">
                <div className="schedule-section-label">
                    <span className="mono">
                        28—31 OCTOBER
                    </span>

                    <h2>
                        SPORTS
                        <br />
                        AREA.
                    </h2>

                    <p>
                        Sports events run across all four
                        festival days. Exact match timings
                        will be announced separately.
                    </p>
                </div>

                <div className="schedule-sports-grid">
                    {sports.map((sport) => (
                        <div
                            className="schedule-sport-card"
                            key={sport.name}
                        >
                            <span className="mono">
                                SPORTS
                            </span>

                            <h3>{sport.name}</h3>

                            <p>{sport.venue}</p>

                            <span className="schedule-sport-date">
                                28—31 OCT
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL NOTE */}

            <div className="schedule-footer-note">
                <span className="mono">
                    PANACEA ’26 · GMC KATHUA
                </span>

                <p>
                    Times marked TBA will be announced by
                    the respective event teams. Sports
                    competitions run throughout the
                    four-day festival.
                </p>
            </div>
        </main>
    );
}

/* =========================================================
   CARD PAGE
   ========================================================= */

function CardPage() {
    const { user, logout } = useAuth();
    const [, setLoc] = useLocation();

    const [passType, setPassType] = useState<
        "without_accommodation" | "with_accommodation"
    >("without_accommodation");

    const [termsOpen, setTermsOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const price =
        passType === "with_accommodation" ? 1500 : 1000;

    return (
        <main className="shell">
            <PageTitle
                tag="Access pass"
                title="BR CARD."
                sub="Your key to the PANACEA experience."
            />

            <div
                className="two-col"
                style={{ paddingBottom: 90 }}
            >
                {/* =========================
            LEFT — BR CARD PREVIEW
        ========================== */}
                <div>
                    <div className="pass-wrap">
                        <span className="mono">
                            GOVERNMENT MEDICAL COLLEGE · KATHUA
                        </span>

                        <h2>
                            PANACEA
                            <br />
                            ’26
                            <br />

                            <span
                                style={{
                                    color: "var(--cream)",
                                    WebkitTextStroke: "1px var(--ink)",
                                }}
                            >
                                BR CARD
                            </span>
                        </h2>

                        <p
                            className="mono"
                            style={{ fontSize: 11 }}
                        >
                            28—31 OCTOBER 2026
                        </p>

                        <div className="pass-bottom">
                            <div>
                                <div
                                    className="mono"
                                    style={{ fontSize: 10 }}
                                >
                                    {user?.fullName ||
                                        "PANACEA ACCOUNT HOLDER"}
                                </div>

                                <p>
                                    {user?.collegeName ||
                                        "Government Medical College Kathua"}
                                    <br />
                                    VALIDITY · 28—31 OCT 2026
                                </p>
                            </div>

                            {/* QR will be generated after payment
                  verification */}
                            <div
                                className="qr"
                                aria-label="QR code generated after payment verification"
                            />
                        </div>

                        <div
                            className="mono"
                            style={{
                                fontSize: 9,
                                marginTop: 21,
                            }}
                        >
                            PASS ID · GENERATED AFTER PAYMENT
                        </div>
                    </div>
                </div>

                {/* =========================
            RIGHT — BR CARD DETAILS
        ========================== */}
                <div>
                    <h2
                        className="section-title"
                        style={{ fontSize: 40 }}
                    >
                        THE PASS
                        <br />
                        DETAILS.
                    </h2>

                    {/* VALIDITY */}
                    <Info
                        label="Validity"
                        value="28–31 October 2026"
                    />

                    {/* LOCATION */}
                    <Info
                        label="Location"
                        value="Government Medical College Kathua"
                    />

                    {/* BENEFITS */}
                    {/* BENEFITS */}
                    <div
                        style={{
                            marginTop: 28,
                            paddingBottom: 24,
                            borderBottom: "1px solid var(--ink)",
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: 12,
                                marginBottom: 16,
                            }}
                        >
                            BENEFITS
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: "0",
                                borderTop: "1px solid var(--ink)",
                                borderLeft: "1px solid var(--ink)",
                            }}
                        >
                            {[
                                "Access to PANACEA ’26 events and activities",
                                "Entry to the cultural and entertainment nights",
                                "Access to sports and academic events",
                                "Participation/entry to eligible competitions and activities",
                                "Accommodation included with the ₹1,500 pass",
                                "Exclusive PANACEA ’26 BR Card",
                            ].map((benefit, index) => (
                                <div
                                    key={benefit}
                                    style={{
                                        padding: "16px 14px",
                                        borderRight:
                                            "1px solid var(--ink)",
                                        borderBottom:
                                            "1px solid var(--ink)",
                                        minHeight: 82,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 12,
                                    }}
                                >
                                    <span
                                        className="mono"
                                        style={{
                                            fontSize: 10,
                                            minWidth: 20,
                                            paddingTop: 3,
                                        }}
                                    >
                                        0{index + 1}
                                    </span>

                                    <span
                                        style={{
                                            fontSize: 15,
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =========================
              PASS SELECTION
          ========================== */}
                    <div style={{ marginTop: 30 }}>
                        <span className="mono">
                            CHOOSE YOUR PASS
                        </span>

                        <div
                            style={{
                                display: "grid",
                                gap: 12,
                                marginTop: 14,
                            }}
                        >
                            {/* WITHOUT ACCOMMODATION */}
                            <label
                                className="paper-panel"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    cursor: "pointer",
                                    border:
                                        passType ===
                                            "without_accommodation"
                                            ? "2px solid var(--ink)"
                                            : undefined,
                                }}
                            >
                                <input
                                    type="radio"
                                    name="passType"
                                    value="without_accommodation"
                                    checked={
                                        passType ===
                                        "without_accommodation"
                                    }
                                    onChange={() => {
                                        setPassType(
                                            "without_accommodation"
                                        );
                                    }}
                                />

                                <div>
                                    <strong>
                                        ₹1,000 — Without Accommodation
                                    </strong>

                                    <div
                                        className="mono"
                                        style={{
                                            fontSize: 9,
                                            marginTop: 5,
                                        }}
                                    >
                                        BR CARD · 28—31 OCT 2026
                                    </div>
                                </div>
                            </label>

                            {/* WITH ACCOMMODATION */}
                            <label
                                className="paper-panel"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    cursor: "pointer",
                                    border:
                                        passType ===
                                            "with_accommodation"
                                            ? "2px solid var(--ink)"
                                            : undefined,
                                }}
                            >
                                <input
                                    type="radio"
                                    name="passType"
                                    value="with_accommodation"
                                    checked={
                                        passType ===
                                        "with_accommodation"
                                    }
                                    onChange={() => {
                                        setPassType(
                                            "with_accommodation"
                                        );
                                    }}
                                />

                                <div>
                                    <strong>
                                        ₹1,500 — With Accommodation
                                    </strong>

                                    <div
                                        className="mono"
                                        style={{
                                            fontSize: 9,
                                            marginTop: 5,
                                        }}
                                    >
                                        BR CARD + ACCOMMODATION
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* =========================
              TERMS & CONDITIONS
          ========================== */}
                    <div style={{ marginTop: 30 }}>
                        <button
                            type="button"
                            onClick={() =>
                                setTermsOpen((prev) => !prev)
                            }
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "transparent",
                                border: "none",
                                borderBottom:
                                    "1px solid var(--ink)",
                                padding: "14px 0",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                textAlign: "left",
                            }}
                        >
                            <span className="mono">
                                TERMS & CONDITIONS
                            </span>

                            <span
                                style={{
                                    fontSize: 22,
                                    lineHeight: 1,
                                }}
                            >
                                {termsOpen ? "−" : "+"}
                            </span>
                        </button>

                        {/* EXPANDED TERMS */}
                        {termsOpen && (
                            <div
                                style={{
                                    padding: "18px 0 8px",
                                }}
                            >
                                <ol
                                    style={{
                                        margin: 0,
                                        paddingLeft: 22,
                                        display: "grid",
                                        gap: 12,
                                    }}
                                >
                                    <li>
                                        The BR Card is personal and
                                        non-transferable.
                                    </li>

                                    <li>
                                        Valid registration and payment
                                        are required for confirmation.
                                    </li>

                                    <li>
                                        Event access may be subject to
                                        venue capacity and individual
                                        event rules.
                                    </li>

                                    <li>
                                        Accommodation is available only
                                        with the accommodation-inclusive
                                        pass.
                                    </li>

                                    <li>
                                        PANACEA ’26 reserves the right
                                        to modify the event schedule or
                                        access guidelines if required.
                                    </li>
                                </ol>
                            </div>
                        )}

                        {/* MANDATORY ACCEPTANCE */}
                        <label
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 10,
                                marginTop: 18,
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={(e) =>
                                    setTermsAccepted(
                                        e.target.checked
                                    )
                                }
                                style={{
                                    marginTop: 3,
                                    width: 16,
                                    height: 16,
                                    flexShrink: 0,
                                }}
                            />

                            <span style={{ fontSize: 14 }}>
                                I have read and agree to the{" "}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTermsOpen(true);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        font: "inherit",
                                        fontWeight: 700,
                                    }}
                                >
                                    Terms & Conditions
                                </button>
                                .
                            </span>
                        </label>
                    </div>

                    {/* =========================
              PAYMENT CTA
          ========================== */}
                    <div style={{ marginTop: 24 }}>
                        {!user ? (
                            <>
                                <button
                                    className="button"
                                    onClick={() => setLoc("/login")}
                                >
                                    LOGIN TO CONTINUE
                                    <ArrowRight size={15} />
                                </button>

                                <p style={{ marginTop: 14 }}>
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        style={{
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <button
                                className="button"
                                disabled={!termsAccepted}
                                onClick={() => {
                                    if (!termsAccepted) return;

                                    setLoc(
                                        `/br-card/checkout?type=${passType}`
                                    );
                                }}
                                style={{
                                    opacity: termsAccepted ? 1 : 0.45,
                                    cursor: termsAccepted
                                        ? "pointer"
                                        : "not-allowed",
                                }}
                            >
                                CONTINUE TO PAYMENT · ₹{price}
                                <ArrowRight size={15} />
                            </button>
                        )}
                    </div>

                    {/* =========================
              PAYMENT SUPPORT
          ========================== */}
                    <div
                        className="notice"
                        style={{ marginTop: 24 }}
                    >
                        <strong>
                            HAVING AN ISSUE WITH PAYMENT?
                        </strong>

                        <p style={{ marginTop: 8 }}>
                            If you are unable to complete your
                            payment, contact the PANACEA organisers
                            for assistance.
                        </p>

                        <a
                            href="mailto:REPLACE_WITH_OFFICIAL_EMAIL"
                            style={{
                                textDecoration: "underline",
                                fontWeight: 700,
                            }}
                        >
                            EMAIL ORGANISER
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}


/* =========================================================
   AUTH PAGE
   ========================================================= */

function AuthPage({
    mode,
}: {
    mode: "login" | "signup";
}) {
    const { login, signup } = useAuth();

    const [, setLoc] = useLocation();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [values, setValues] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        collegeName: "",
        otherCollegeName: "",
        city: "",
        state: "",
        password: "",
        confirmPassword: "",
    });

    const update = (
        key: keyof typeof values,
        value: string
    ) => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    /* =====================================================
       VALIDATION
       ===================================================== */

    const validateSignup = () => {
        const fullName = values.fullName.trim();
        const email = values.email.trim();
        const phone = values.phoneNumber.trim();
        const city = values.city.trim();

        /* FULL NAME */
        if (!fullName) {
            return "Please enter your full name.";
        }

        if (
            !/^[A-Za-z][A-Za-z .'-]{1,99}$/.test(
                fullName
            )
        ) {
            return "Please enter a valid full name.";
        }

        /* PHONE */
        if (!/^[6-9]\d{9}$/.test(phone)) {
            return "Please enter a valid 10-digit Indian mobile number.";
        }

        /* COLLEGE */
        if (!values.collegeName) {
            return "Please select your college.";
        }

        if (
            values.collegeName === "OTHER" &&
            !values.otherCollegeName.trim()
        ) {
            return "Please enter your college name.";
        }

        /* CITY */
        if (!city) {
            return "Please enter your city.";
        }

        if (
            !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(
                city
            )
        ) {
            return "Please enter a valid city.";
        }

        /* STATE */
        if (!values.state) {
            return "Please select your state / UT.";
        }

        /* EMAIL */
        if (!email) {
            return "Please enter your email address.";
        }

        if (
            !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                email
            )
        ) {
            return "Please enter a valid email address.";
        }

        /* PASSWORD */
        if (values.password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        if (!/[A-Za-z]/.test(values.password)) {
            return "Password must contain at least one letter.";
        }

        if (!/\d/.test(values.password)) {
            return "Password must contain at least one number.";
        }

        /* CONFIRM PASSWORD */
        if (!values.confirmPassword) {
            return "Please confirm your password.";
        }

        if (
            values.password !==
            values.confirmPassword
        ) {
            return "Passwords do not match.";
        }

        return "";
    };

    /* =====================================================
       SUBMIT
       ===================================================== */

    const submit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setError("");

        /* SIGNUP VALIDATION */
        if (mode === "signup") {
            const validationError =
                validateSignup();

            if (validationError) {
                setError(validationError);
                return;
            }
        }

        /* LOGIN VALIDATION */
        if (mode === "login") {
            if (!values.email.trim()) {
                setError(
                    "Please enter your email address."
                );
                return;
            }

            if (!values.password) {
                setError(
                    "Please enter your password."
                );
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === "signup") {
                const collegeName =
                    values.collegeName === "OTHER"
                        ? values.otherCollegeName.trim()
                        : values.collegeName.trim();

                await signup({
                    fullName:
                        values.fullName.trim(),

                    email:
                        values.email.trim(),

                    phoneNumber:
                        values.phoneNumber.trim(),

                    collegeName,

                    city:
                        values.city.trim(),

                    state:
                        values.state.trim(),

                    password:
                        values.password,
                });

                setLoc("/");
                return;
            }

            const loggedInUser = await login({
                email:
                    values.email.trim(),

                password:
                    values.password,
            });

            const isAdmin =
                Array.isArray(
                    loggedInUser.roles
                ) &&
                loggedInUser.roles.some(
                    (role: string) =>
                        role === "ROLE_ADMIN" ||
                        role === "ADMIN"
                );

            if (isAdmin) {
                setLoc("/admin");
            } else {
                setLoc("/profile");
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Authentication failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="shell">
            <div
                className="two-col"
                style={{
                    padding: "65px 0 95px",
                }}
            >
                {/* =================================================
                   LEFT SIDE
                   ================================================= */}

                <div>
                    <div className="sticker">
                        {mode === "signup"
                            ? "WELCOME TO PANACEA ’26"
                            : "YOUR PANACEA ACCOUNT"}
                    </div>

                    <h1
                        className="display"
                        style={{
                            fontSize:
                                "clamp(58px,9vw,110px)",
                            margin: "28px 0",
                        }}
                    >
                        {mode === "signup" ? (
                            <>
                                JOIN THE
                                <br />
                                FEST.
                            </>
                        ) : (
                            <>
                                WELCOME
                                <br />
                                BACK.
                            </>
                        )}
                    </h1>

                    <p
                        style={{
                            lineHeight: 1.75,
                            maxWidth: 420,
                        }}
                    >
                        {mode === "signup"
                            ? "Create your PANACEA ’26 account to manage your profile, event registrations and fest passes."
                            : "Log in to access your PANACEA ’26 profile, registrations and passes."}
                    </p>

                    <div
                        className="checker"
                        style={{
                            marginTop: 32,
                        }}
                    />
                </div>

                {/* =================================================
                   FORM
                   ================================================= */}

                <div className="paper-panel">
                    <span className="eyebrow">
                        {mode === "signup"
                            ? "Create your account"
                            : "Access your account"}
                    </span>

                    <h2
                        className="section-title"
                        style={{
                            fontSize: 34,
                        }}
                    >
                        {mode === "signup"
                            ? "SIGN UP"
                            : "LOG IN"}
                    </h2>

                    <form
                        className="form-stack"
                        onSubmit={submit}
                        noValidate
                    >
                        {/* =================================================
                           SIGNUP ONLY
                           ================================================= */}

                        {mode === "signup" && (
                            <>
                                {/* FULL NAME */}

                                <Field
                                    label="Full name"
                                    value={
                                        values.fullName
                                    }
                                    placeholder="Enter your full name"
                                    onChange={(value) =>
                                        update(
                                            "fullName",
                                            value
                                        )
                                    }
                                    required
                                />

                                {/* PHONE */}

                                <Field
                                    label="Phone number"
                                    type="tel"
                                    value={
                                        values.phoneNumber
                                    }
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    inputMode="numeric"
                                    onChange={(value) =>
                                        update(
                                            "phoneNumber",
                                            value
                                                .replace(
                                                    /\D/g,
                                                    ""
                                                )
                                                .slice(
                                                    0,
                                                    10
                                                )
                                        )
                                    }
                                    required
                                />

                                {/* COLLEGE */}

                                <label>
                                    College name

                                    <select
                                        value={
                                            values.collegeName
                                        }
                                        onChange={(event) =>
                                            update(
                                                "collegeName",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select your college
                                        </option>

                                        {COLLEGES.map(
                                            (college) => (
                                                <option
                                                    key={
                                                        college
                                                    }
                                                    value={
                                                        college
                                                    }
                                                >
                                                    {college}
                                                </option>
                                            )
                                        )}

                                        <option value="OTHER">
                                            Other
                                        </option>
                                    </select>
                                </label>

                                {/* OTHER COLLEGE */}

                                {values.collegeName ===
                                    "OTHER" && (
                                        <Field
                                            label="College name"
                                            value={
                                                values.otherCollegeName
                                            }
                                            placeholder="Enter your college name"
                                            onChange={(value) =>
                                                update(
                                                    "otherCollegeName",
                                                    value
                                                )
                                            }
                                            required
                                        />
                                    )}

                                {/* CITY */}

                                <Field
                                    label="City"
                                    value={
                                        values.city
                                    }
                                    placeholder="Enter your city"
                                    onChange={(value) =>
                                        update(
                                            "city",
                                            value
                                        )
                                    }
                                    required
                                />

                                {/* STATE */}

                                <label>
                                    State / UT

                                    <select
                                        value={
                                            values.state
                                        }
                                        onChange={(event) =>
                                            update(
                                                "state",
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select your state / UT
                                        </option>

                                        {STATES.map(
                                            (state) => (
                                                <option
                                                    key={
                                                        state
                                                    }
                                                    value={
                                                        state
                                                    }
                                                >
                                                    {state}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>
                            </>
                        )}

                        {/* =================================================
                           EMAIL
                           ================================================= */}

                        <Field
                            label="Email"
                            type="email"
                            value={values.email}
                            placeholder="you@example.com"
                            onChange={(value) =>
                                update(
                                    "email",
                                    value
                                )
                            }
                            required
                        />

                        {/* =================================================
                           PASSWORD
                           ================================================= */}

                        <Field
                            label="Password"
                            type="password"
                            value={
                                values.password
                            }
                            placeholder="Minimum 8 characters"
                            minLength={8}
                            onChange={(value) =>
                                update(
                                    "password",
                                    value
                                )
                            }
                            required
                        />

                        {/* =================================================
                           CONFIRM PASSWORD
                           ================================================= */}

                        {mode === "signup" && (
                            <>
                                <Field
                                    label="Confirm password"
                                    type="password"
                                    value={
                                        values.confirmPassword
                                    }
                                    placeholder="Re-enter your password"
                                    minLength={8}
                                    onChange={(value) =>
                                        update(
                                            "confirmPassword",
                                            value
                                        )
                                    }
                                    required
                                />

                                {/* PASSWORD RULES */}

                                <div className="auth-password-rules">
                                    <span>
                                        PASSWORD
                                        REQUIREMENTS
                                    </span>

                                    <ul>
                                        <li
                                            className={
                                                values
                                                    .password
                                                    .length >=
                                                    8
                                                    ? "valid"
                                                    : ""
                                            }
                                        >
                                            At least 8
                                            characters
                                        </li>

                                        <li
                                            className={
                                                /[A-Za-z]/.test(
                                                    values.password
                                                )
                                                    ? "valid"
                                                    : ""
                                            }
                                        >
                                            At least one
                                            letter
                                        </li>

                                        <li
                                            className={
                                                /\d/.test(
                                                    values.password
                                                )
                                                    ? "valid"
                                                    : ""
                                            }
                                        >
                                            At least one
                                            number
                                        </li>

                                        <li
                                            className={
                                                values
                                                    .confirmPassword
                                                    .length >
                                                    0 &&
                                                    values.password ===
                                                    values.confirmPassword
                                                    ? "valid"
                                                    : ""
                                            }
                                        >
                                            Passwords
                                            must match
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}

                        {/* =================================================
                           ERROR
                           ================================================= */}

                        {error && (
                            <div
                                role="alert"
                                className="notice auth-error"
                            >
                                {error}
                            </div>
                        )}

                        {/* =================================================
                           SUBMIT
                           ================================================= */}

                        <button
                            className="button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "PLEASE WAIT..."
                                : mode === "signup"
                                    ? "CREATE ACCOUNT"
                                    : "LOG IN"}

                            {!loading && (
                                <ArrowRight
                                    size={15}
                                />
                            )}
                        </button>
                    </form>

                    {/* =================================================
                       SWITCH AUTH
                       ================================================= */}

                    <p
                        style={{
                            fontSize: 13,
                        }}
                    >
                        {mode === "signup"
                            ? "Already have an account? "
                            : "New to PANACEA? "}

                        <Link
                            style={{
                                textDecoration:
                                    "underline",
                            }}
                            href={
                                mode === "signup"
                                    ? "/login"
                                    : "/signup"
                            }
                        >
                            {mode === "signup"
                                ? "Log in"
                                : "Sign up"}
                        </Link>
                    </p>

                    {mode === "login" && (
                        <p
                            className="mono"
                            style={{
                                fontSize: 9,
                                marginTop: 18,
                            }}
                        >
                            PASSWORD RESET ·
                            COMING SOON
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}


/* =========================================================
   FIELD
   ========================================================= */

function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder,
    maxLength,
    minLength,
    inputMode,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    inputMode?:
    | "text"
    | "numeric"
    | "tel"
    | "email"
    | "url";
}) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (
        <label>
            {label}

            <div
                style={{
                    position: "relative",
                    width: "100%",
                }}
            >
                <input
                    type={
                        isPassword && showPassword
                            ? "text"
                            : type
                    }
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    inputMode={inputMode}
                    autoComplete={
                        type === "password"
                            ? "new-password"
                            : type === "email"
                                ? "email"
                                : undefined
                    }
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "36px",
                            height: "36px",
                            padding: 0,
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "none",
                            color: "#111",
                            cursor: "pointer",
                            zIndex: 10,
                        }}
                    >
                        {showPassword ? (
                            <EyeOff size={22} color="#111" />
                        ) : (
                            <Eye size={22} color="#111" />
                        )}
                    </button>
                )}
            </div>
        </label>
    );
}
/* =========================================================
   DASH TILE
   ========================================================= */

function DashTile({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="category yellow"
            style={{ minHeight: 155 }}
        >
            <span
                className="mono"
                style={{ fontSize: 9 }}
            >
                {label}
            </span>

            <strong
                className="display"
                style={{ fontSize: 31 }}
            >
                {value}
            </strong>

            <span
                className="mono"
                style={{ fontSize: 9 }}
            >
                OPEN ↗
            </span>
        </Link>
    );
}

/* =========================================================
   REGISTRATIONS
   ========================================================= */

function RegistrationsPage() {
    const { user } =
        useAuth();

    const { demo } =
        useDemo();

    const list = events.filter(
        (event) =>
            demo.registrations.includes(
                event.id
            )
    );

    if (!user) {
        return (
            <main className="shell">
                <PageTitle
                    tag="Your festival ledger"
                    title="MY<br/>REGISTRATIONS."
                />

                <Link
                    className="button"
                    href="/login"
                >
                    LOG IN TO CONTINUE
                </Link>
            </main>
        );
    }

    return (
        <main className="shell">
            <PageTitle
                tag="Your festival ledger"
                title="MY<br/>REGISTRATIONS."
            />


            {list.length ? (
                <div
                    className="event-grid"
                    style={{
                        margin:
                            "28px 0 85px",
                    }}
                >
                    {list.map((event) => (
                        <div
                            className="paper-panel"
                            key={event.id}
                        >
                            <span className="pill">
                                {event.category}
                            </span>

                            <h2
                                className="display"
                                style={{ fontSize: 26 }}
                            >
                                {event.name}
                            </h2>

                            <p>
                                {event.date} ·{" "}
                                {event.venue}
                            </p>

                            <Info
                                label="Registration ID"
                                value={`PN26-${event.id
                                    .toUpperCase()
                                    .slice(0, 10)}`}
                            />

                            <span
                                className="mono"
                                style={{ fontSize: 10 }}
                            >
                                STATUS · REGISTERED
                            </span>

                            <p>
                                <Link
                                    className="button paper"
                                    href={`/events/${event.id}`}
                                >
                                    VIEW DETAILS
                                </Link>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="NO REGISTRATIONS YET."
                    text="Browse the event posters and register for an event."
                    href="/events"
                    action="FIND AN EVENT"
                />
            )}
        </main>
    );
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function EmptyState({
    title,
    text,
    href,
    action,
}: {
    title: string;
    text: string;
    href: string;
    action: string;
}) {
    return (
        <div
            className="paper-panel"
            style={{
                margin:
                    "30px 0 85px",
            }}
        >
            <div
                className="sunburst"
                style={{ position: "static" }}
            >
                ✳
            </div>

            <h2
                className="display"
                style={{ fontSize: 36 }}
            >
                {title}
            </h2>

            <p>{text}</p>

            <Link
                className="button"
                href={href}
            >
                {action}
                <ArrowRight size={15} />
            </Link>
        </div>
    );
}

/* =========================================================
   EXPORT
   ========================================================= */

export default App;