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
import {
    Route,
    Switch,
    Link,
    useLocation,
    useParams,
    Router as WouterRouter,
} from "wouter";

import {
    ArrowDownRight,
    ArrowRight,
    CalendarDays,
    ChevronDown,
    CircleUserRound,
    MapPin,
    Menu,
    Search,
    Ticket,
    X,
} from "lucide-react";

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
                                    onClick={() => setNotice("")}
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

/* =========================================================
   ROUTER
   ========================================================= */

function Router() {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      <Layout />

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/events" component={EventsPage} />
        <Route path="/events/:id" component={EventDetail} />
        <Route path="/schedule" component={SchedulePage} />

        <Route
          path="/br-card"
          component={BrCardPage}
        />

        <Route path="/about" component={AboutPage} />

        <Route
          path="/login"
          component={() => (
            <AuthPage mode="login" />
          )}
        />

        <Route
          path="/signup"
          component={() => (
            <AuthPage mode="signup" />
          )}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          component={ProfileHome}
        />

        {/* BR CARD FLOW */}
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

        <Route component={NotFound} />
      </Switch>

      <Footer />
    </ErrorBoundary>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

function Layout() {
    const [open, setOpen] = useState(false);

    const { user } = useAuth();

    const [loc] = useLocation();

    const links = [
        ["Home", "/"],
        ["Events", "/events"],
        ["Schedule", "/schedule"],
        ["BR Card", "/br-card"],

        ["About", "/about"],
    ];

    return (
        <header className="topbar">
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

            <nav
                className="navlinks"
                aria-label="Main navigation"
            >
                {links.map(([name, href]) => (
                    <Link
                        key={href}
                        className={
                            loc === href ? "active" : ""
                        }
                        href={href}
                    >
                        {name.toUpperCase()}
                    </Link>
                ))}
            </nav>

            <div className="nav-actions">
                <Link
                    className="button ink"
                    href={user ? "/profile" : "/login"}
                >
                    {user ? (
                        <>
                            <CircleUserRound size={15} />
                            {user.fullName
                                .split(" ")[0]
                                .toUpperCase()}
                        </>
                    ) : (
                        "LOGIN / SIGN UP"
                    )}
                </Link>

                <button
                    className="mobile-toggle"
                    aria-label={
                        open ? "Close menu" : "Open menu"
                    }
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <nav
                    className="mobile-panel"
                    aria-label="Mobile navigation"
                >
                    {links.map(([name, href]) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                        >
                            {name.toUpperCase()}
                        </Link>
                    ))}

                    <Link
                        href={user ? "/profile" : "/login"}
                        onClick={() => setOpen(false)}
                    >
                        {user
                            ? "MY PANACEA"
                            : "LOGIN / SIGN UP"}
                    </Link>
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
        <footer className="footer">
            <div className="shell footer-grid">
                <div>
                    <Link
                        className="brand"
                        href="/"
                    >
                        PANACEA ’26
                        <small>
                            GOVERNMENT MEDICAL COLLEGE, KATHUA
                        </small>
                    </Link>

                    <p
                        style={{
                            maxWidth: 330,
                            lineHeight: 1.6,
                        }}
                    >
                        Culture · Chaos · Crescendo
                        <br />
                        28—31 October 2026
                    </p>

                    <span className="sticker">
                        FOUR DAYS. COUNTLESS MEMORIES.
                    </span>
                </div>

                <div>
                    <span className="mono">
                        Find your way
                    </span>

                    <Link href="/events">
                        Events
                    </Link>

                    <Link href="/schedule">
                        Schedule
                    </Link>

                    <Link href="/about">
                        About the fest
                    </Link>
                </div>

                <div>
                    <span className="mono">
                        Passes & support
                    </span>

                    <Link href="/br-card">
                        BR Card
                    </Link>

                    <Link href="/delegate-card">
                        Delegate Card
                    </Link>

                    <span className="mono">
                        Contact · Details TBA
                    </span>
                </div>
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
                            href="/schedule"
                        >
                            THE SCHEDULE
                            <CalendarDays size={15} />
                        </Link>
                    </div>
                </div>

                <div
                    className="hero-art"
                    aria-label="Illustrated festival guitar, eyes and mushrooms"
                >
                    <span className="sunburst">
                        ✳
                    </span>

                    <span
                        className="eye one"
                        aria-hidden="true"
                    >
                        ◉
                    </span>

                    <span
                        className="eye two"
                        aria-hidden="true"
                    >
                        ◉
                    </span>

                    <div className="guitar" />
                    <div className="mushroom" />

                    <div
                        className="checker"
                        style={{
                            position: "absolute",
                            bottom: 5,
                            left: "-20%",
                            right: "-20%",
                        }}
                    />
                </div>
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
                            ANNOUNCEMENT · FEST ’26
                        </span>

                        <h3
                            className="display"
                            style={{ fontSize: 28 }}
                        >
                            The dates are in.
                        </h3>

                        <p
                            style={{
                                lineHeight: 1.7,
                            }}
                        >
                            PANACEA ’26 runs 28—31 October 2026
                            at GMC Kathua. Event-by-event dates,
                            times, eligibility, venues and
                            registration terms will be shared here
                            when confirmed.
                        </p>

                        <p
                            className="mono"
                            style={{ fontSize: 10 }}
                        >
                            UPDATED · DETAILS TBA
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

    const { demo } = useDemo();

    useEffect(() => {
        const categoryParam =
            new URLSearchParams(
                window.location.search
            ).get("category");

        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [loc]);

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

    const [, setLoc] = useLocation();

    const event = events.find(
        (event) => event.id === id
    );

    const { user } = useAuth();

    const {
        demo,
        setDemo,
        flash,
    } = useDemo();

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

    const registered =
        demo.registrations.includes(event.id);

    const saved =
        demo.saved.includes(event.id);

    const register = () => {
        if (!user) {
            flash(
                "Please log in before registering for an event."
            );

            setLoc("/login");
            return;
        }

        setDemo({
            ...demo,
            registrations: registered
                ? demo.registrations.filter(
                    (value) => value !== event.id
                )
                : [
                    ...demo.registrations,
                    event.id,
                ],
        });

        flash(
            registered
                ? "Event registration removed."
                : "Event registration saved."
        );
    };

    const toggleSave = () => {
        if (!user) {
            flash(
                "Please log in to save events."
            );

            setLoc("/login");
            return;
        }

        setDemo({
            ...demo,
            saved: saved
                ? demo.saved.filter(
                    (value) => value !== event.id
                )
                : [
                    ...demo.saved,
                    event.id,
                ],
        });

        flash(
            saved
                ? "Removed from your schedule."
                : "Saved to your schedule."
        );
    };

    return (
        <main className="shell">
            <div className="page-intro">
                <div className="eyebrow">
                    {event.category} / {event.type} /
                    PANACEA ’26
                </div>

                <h1>{event.name}</h1>

                <p
                    style={{
                        maxWidth: 660,
                        fontSize: 18,
                        lineHeight: 1.6,
                    }}
                >
                    {event.description}
                </p>

                <span className="sticker">
                    DETAILS BEING CONFIRMED
                </span>
            </div>

            <div
                className="two-col"
                style={{ paddingBottom: 80 }}
            >
                <div
                    className={`pass-wrap ${event.category === "Sports"
                        ? "blue"
                        : event.category === "Academic"
                            ? "yellow"
                            : ""
                        }`}
                >
                    <span className="mono">
                        PANACEA ’26 · EVENT FILE
                    </span>

                    <h2
                        style={{
                            fontSize:
                                "clamp(40px,8vw,82px)",
                            marginTop: 42,
                        }}
                    >
                        {event.name}
                    </h2>

                    <div
                        className="checker"
                        style={{ marginTop: 35 }}
                    />

                    <div className="pass-bottom">
                        <div>
                            <div
                                className="mono"
                                style={{ fontSize: 10 }}
                            >
                                DATE / TIME / VENUE
                            </div>

                            <p>
                                {event.date}
                                <br />
                                {event.time}
                                <br />
                                {event.venue}
                            </p>
                        </div>

                        <ArrowDownRight size={34} />
                    </div>
                </div>

                <div>
                    <h2
                        className="section-title"
                        style={{ fontSize: 38 }}
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

                    <Info
                        label="Eligibility"
                        value={event.eligibility}
                    />

                    <Info
                        label="Team size"
                        value={event.team}
                    />

                    <Info
                        label="Registration fee"
                        value={event.fee}
                    />

                    <Info
                        label="Organizer"
                        value={`${event.organizer} · contact details TBA`}
                    />

                    <Info
                        label="Rules & instructions"
                        value={event.rules}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            flexWrap: "wrap",
                            marginTop: 25,
                        }}
                    >
                        <button
                            className="button"
                            onClick={register}
                        >
                            {registered
                                ? "CANCEL REGISTRATION"
                                : "REGISTER FOR EVENT"}

                            <ArrowRight size={15} />
                        </button>

                        <button
                            className="button paper"
                            onClick={toggleSave}
                        >
                            {saved
                                ? "REMOVE FROM SCHEDULE"
                                : "ADD TO SCHEDULE"}

                            <CalendarDays size={15} />
                        </button>
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

/* =========================================================
   SCHEDULE
   ========================================================= */

function SchedulePage() {
    const [day, setDay] = useState(0);

    return (
        <main className="shell">
            <PageTitle
                tag="A four-day festival / 28—31 October 2026"
                title="THE<br/>TIME-TABLE."
                sub="Switch days to explore the festival programme. Individual event dates, start times and venue assignments are not confirmed yet."
            />

            <div
                className="schedule-tabs"
                role="tablist"
                aria-label="Festival days"
            >
                {days.map((dayItem, index) => (
                    <button
                        role="tab"
                        aria-selected={day === index}
                        className={
                            day === index
                                ? "selected"
                                : ""
                        }
                        key={dayItem.date}
                        onClick={() =>
                            setDay(index)
                        }
                    >
                        {dayItem.label} —{" "}
                        {dayItem.date}
                    </button>
                ))}
            </div>

            <div className="sticker">
                {days[day].label} · 2026 · PROGRAMME TBA
            </div>

            <div
                className="paper-panel"
                style={{
                    margin: "26px 0 28px",
                }}
            >
                <span className="mono">
                    DAILY PROGRAMME ·{" "}
                    {days[day].date} 2026
                </span>

                <h2
                    className="display"
                    style={{ fontSize: 35 }}
                >
                    THE LINE-UP IS TAKING SHAPE.
                </h2>

                <p style={{ lineHeight: 1.7 }}>
                    Event-by-event date assignments, times
                    and campus venues are TBA. No event
                    has been assigned to this date yet.
                </p>
            </div>

            <h2
                className="section-title"
                style={{ fontSize: 32 }}
            >
                EVENTS IN THE FESTIVAL MIX
            </h2>

            <p
                className="mono"
                style={{ fontSize: 10 }}
            >
                NOT IN DAY ORDER · TIME AND VENUE TBA
            </p>

            <div
                style={{ margin: "26px 0 80px" }}
            >
                {events.map((event) => (
                    <div
                        className="schedule-row"
                        key={event.id}
                    >
                        <span className="mono">
                            {event.date}
                        </span>

                        <div>
                            <strong>{event.name}</strong>

                            <small>
                                {event.description}
                            </small>
                        </div>

                        <span
                            className="pill category-cell"
                            style={{
                                background:
                                    event.category ===
                                        "Sports"
                                        ? "var(--blue)"
                                        : event.category ===
                                            "Academic"
                                            ? "var(--yellow)"
                                            : "var(--pink)",
                            }}
                        >
                            {event.category}
                        </span>

                        <span
                            className="mono venue"
                            style={{ fontSize: 9 }}
                        >
                            <MapPin
                                size={13}
                                style={{
                                    verticalAlign:
                                        "middle",
                                }}
                            />{" "}
                            {event.venue}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}

/* =========================================================
   CARD PAGE
   ========================================================= */

function CardPage() {
    const { user } = useAuth();
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
   ABOUT
   ========================================================= */

function AboutPage() {
    return (
        <main>
            <section className="shell">
                <PageTitle
                    tag="The why behind the noise"
                    title="ABOUT<br/>PANACEA."
                    sub="PANACEA is the annual festival of Government Medical College, Kathua: a meeting place for talent, sportsmanship, creativity, academics, culture and entertainment."
                />

                <div
                    className="two-col"
                    style={{ paddingBottom: 75 }}
                >
                    <div>
                        <span className="sticker">
                            CULTURE · CHAOS · CRESCENDO
                        </span>

                        <h2
                            className="section-title"
                            style={{ marginTop: 30 }}
                        >
                            FOUR DAYS.
                            <br />
                            COUNTLESS
                            <br />
                            MEMORIES.
                            <br />
                            ONE COMPLETE
                            <br />
                            CURE.
                        </h2>
                    </div>

                    <div>
                        <h3
                            className="display"
                            style={{ fontSize: 26 }}
                        >
                            A campus in full colour.
                        </h3>

                        <p
                            style={{ lineHeight: 1.8 }}
                        >
                            PANACEA ’26 brings together
                            inter-college sport, performance,
                            art, academic exchange and live
                            shows. It is made for the people who
                            compete, create, question, cheer and
                            keep the chorus going.
                        </p>

                        <p
                            style={{ lineHeight: 1.8 }}
                        >
                            The festival is organized by
                            Government Medical College,
                            Kathua. Individual schedules,
                            locations and participation details
                            will be published after confirmation.
                        </p>

                        <div
                            className="checker"
                            style={{ marginTop: 28 }}
                        />
                    </div>
                </div>
            </section>

            <section className="section dark">
                <div className="shell">
                    <div className="eyebrow">
                        Who's making the festival
                    </div>

                    <h2 className="section-title">
                        FEST
                        <br />
                        COORDINATORS.
                    </h2>

                    <div className="organizer-grid">
                        {organizers.map(
                            (organizer) => (
                                <div
                                    className="organizer"
                                    key={organizer.role}
                                >
                                    <span
                                        className="mono"
                                        style={{ fontSize: 9 }}
                                    >
                                        {organizer.role}
                                    </span>

                                    <strong>
                                        {organizer.name}
                                    </strong>

                                    <span
                                        style={{ fontSize: 12 }}
                                    >
                                        {organizer.contact}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <p
                        className="mono"
                        style={{
                            marginTop: 22,
                            fontSize: 10,
                        }}
                    >
                        ORGANIZER CONTACT DETAILS · TBA
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="section-head">
                        <div>
                            <div className="eyebrow">
                                Names from the festival notice
                            </div>

                            <h2 className="section-title">
                                THE CREW
                                <br />
                                BEHIND IT.
                            </h2>
                        </div>

                        <p className="section-intro">
                            Expanded event organizer rosters
                            from the reference material. Contact
                            details not legible in source are marked
                            TBA.
                        </p>
                    </div>

                    <OrganizerList
                        title="Cultural event organisers"
                        names={culturalOrganizers}
                    />

                    <OrganizerList
                        title="Sports event organisers"
                        names={sportsOrganizers}
                    />

                    <OrganizerList
                        title="Academic event organisers"
                        names={academicOrganizers}
                    />

                    <div className="notice">
                        Contact details TBA. Please use
                        official GMC Kathua festival channels
                        once announced.
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="shell">
                    <div className="eyebrow">
                        The campus, the gathering
                    </div>

                    <h2 className="section-title">
                        GMC KATHUA.
                    </h2>

                    <p
                        style={{
                            maxWidth: 600,
                            lineHeight: 1.8,
                        }}
                    >
                        Government Medical College, Kathua is
                        the home of PANACEA ’26. Festival venue
                        locations within campus and visitor
                        information are TBA.
                    </p>

                    <Info
                        label="Festival venue"
                        value="Government Medical College, Kathua · exact event venues TBA"
                    />

                    <Info
                        label="Dates"
                        value="28—31 October 2026"
                    />

                    <Info
                        label="Contact"
                        value="Organizer contact details TBA"
                    />
                </div>
            </section>
        </main>
    );
}

/* =========================================================
   ORGANIZER LIST
   ========================================================= */

function OrganizerList({
    title,
    names,
}: {
    title: string;
    names: string;
}) {
    const [expanded, setExpanded] =
        useState(false);

    return (
        <div
            style={{
                borderTop:
                    "1px solid var(--ink)",
                padding: "16px 0",
            }}
        >
            <button
                onClick={() =>
                    setExpanded(!expanded)
                }
                aria-expanded={expanded}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    border: 0,
                    background: "transparent",
                    textAlign: "left",
                    padding: 0,
                    font: "20px Archivo Black",
                    textTransform: "uppercase",
                }}
            >
                {title}
                <ChevronDown size={18} />
            </button>

            {expanded && (
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 18,
                    }}
                >
                    {names
                        .split(", ")
                        .map((name) => (
                            <span
                                className="pill"
                                key={name}
                                style={{
                                    background:
                                        "var(--cream)",
                                }}
                            >
                                {name}
                            </span>
                        ))}
                </div>
            )}
        </div>
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
    const { login, signup } =
        useAuth();

    const [, setLoc] =
        useLocation();

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [values, setValues] =
        useState({
            fullName: "",
            email: "",
            phoneNumber: "",
            collegeName: "",
            city: "",
            state: "",
            password: "",
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

    const submit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                await signup({
                    fullName:
                        values.fullName.trim(),

                    email:
                        values.email.trim(),

                    phoneNumber:
                        values.phoneNumber.trim(),

                    collegeName:
                        values.collegeName.trim(),

                    city:
                        values.city.trim(),

                    state:
                        values.state.trim(),

                    password:
                        values.password,
                });
            } else {
                await login({
                    email:
                        values.email.trim(),

                    password:
                        values.password,
                });
            }

            setLoc("/profile");
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
                    padding:
                        "65px 0 95px",
                }}
            >
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
                        style={{ marginTop: 32 }}
                    />
                </div>

                <div className="paper-panel">
                    <span className="eyebrow">
                        {mode === "signup"
                            ? "Create your account"
                            : "Access your account"}
                    </span>

                    <h2
                        className="section-title"
                        style={{ fontSize: 34 }}
                    >
                        {mode === "signup"
                            ? "SIGN UP"
                            : "LOG IN"}
                    </h2>

                    <form
                        className="form-stack"
                        onSubmit={submit}
                    >
                        {mode === "signup" && (
                            <>
                                <Field
                                    label="Full name"
                                    value={values.fullName}
                                    onChange={(value) =>
                                        update(
                                            "fullName",
                                            value
                                        )
                                    }
                                    required
                                />

                                <Field
                                    label="Phone number"
                                    type="tel"
                                    value={values.phoneNumber}
                                    onChange={(value) =>
                                        update(
                                            "phoneNumber",
                                            value
                                        )
                                    }
                                    required
                                />

                                <label>
                                    College name

                                    <select
                                        value={values.collegeName}
                                        onChange={(e) =>
                                            update("collegeName", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select your college</option>

                                        {COLLEGES.map((college) => (
                                            <option key={college} value={college}>
                                                {college}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <Field
                                    label="City"
                                    value={values.city}
                                    onChange={(value) =>
                                        update(
                                            "city",
                                            value
                                        )
                                    }
                                    required
                                />

                                <label>
                                    State / UT

                                    <select
                                        value={values.state}
                                        onChange={(e) =>
                                            update("state", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Select your state / UT</option>

                                        {STATES.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </>
                        )}

                        <Field
                            label="Email"
                            type="email"
                            value={values.email}
                            onChange={(value) =>
                                update(
                                    "email",
                                    value
                                )
                            }
                            required
                        />

                        <Field
                            label="Password"
                            type="password"
                            value={values.password}
                            onChange={(value) =>
                                update(
                                    "password",
                                    value
                                )
                            }
                            required
                        />

                        {error && (
                            <div
                                role="alert"
                                className="notice"
                                style={{
                                    borderColor:
                                        "var(--pink)",
                                }}
                            >
                                {error}
                            </div>
                        )}

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

                    <p style={{ fontSize: 13 }}>
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
                            PASSWORD RESET · COMING SOON
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
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label>
            {label}

            <input
                type={type}
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                required={required}
                autoComplete={
                    type === "password"
                        ? "current-password"
                        : undefined
                }
            />
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