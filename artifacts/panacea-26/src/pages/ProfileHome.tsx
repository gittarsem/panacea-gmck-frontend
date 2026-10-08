import { useState } from "react";

import ProfileNav, {
    ProfileSection,
} from "../components/ProfileNav";

import MyCards from "./MyCards";
import SavedPage from "./SavedPage";
import SettingsPage from "./SettingsPage";

import { useAuth } from "../context/AuthContext";

function ProfileOverview() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "minmax(0, 1.3fr) minmax(0, 1fr)",
                gap: 35,
                alignItems: "stretch",
            }}
        >
            {/* PROFILE DETAILS */}
            <section
                style={{
                    border: "1px solid #111",
                    padding: 40,
                    boxShadow: "8px 8px 0 #111",
                }}
            >
                <div
                    className="mono"
                    style={{
                        fontSize: 12,
                        marginBottom: 18,
                    }}
                >
                    PROFILE DETAILS
                </div>

                <h1
                    className="display"
                    style={{
                        margin: 0,
                        fontSize: "clamp(44px, 5vw, 72px)",
                        lineHeight: 0.9,
                    }}
                >
                    PROFILE
                </h1>

                <p
                    style={{
                        marginTop: 25,
                        lineHeight: 1.6,
                        maxWidth: 600,
                    }}
                >
                    Manage your PANACEA ’26 registrations, saved
                    events, BR Cards and account settings.
                </p>
            </section>

            {/* PROFILE STATS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 25,
                }}
            >
               

                <div
                    style={{
                        background: "#f5b719",
                        border: "1px solid #111",
                        padding: 30,
                        boxShadow: "7px 7px 0 #111",
                    }}
                >
                    <div className="mono">SAVED EVENTS</div>

                    <div
                        className="display"
                        style={{
                            marginTop: 35,
                            fontSize: 60,
                            lineHeight: 1,
                        }}
                    >
                        0
                    </div>
                </div>

                <div
                    style={{
                        background: "#f5b719",
                        border: "1px solid #111",
                        padding: 30,
                        boxShadow: "7px 7px 0 #111",
                    }}
                >
                    <div className="mono">MY CARDS</div>

                    <div
                        className="display"
                        style={{
                            marginTop: 35,
                            fontSize: 60,
                            lineHeight: 1,
                        }}
                    >
                        1
                    </div>
                </div>

                <div
                    style={{
                        background: "#f5b719",
                        border: "1px solid #111",
                        padding: 30,
                        boxShadow: "7px 7px 0 #111",
                    }}
                >
                    <div className="mono">FESTIVAL DATES</div>

                    <div
                        className="display"
                        style={{
                            marginTop: 35,
                            fontSize: 40,
                            lineHeight: 1,
                        }}
                    >
                        28–31 OCT
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfileHome() {
    const [section, setSection] =
        useState<ProfileSection>("overview");

    const { user } = useAuth();

    const firstName =
        user?.fullName?.trim().split(" ")[0] || "THERE";

    return (
        <main
            style={{
                maxWidth: 1400,
                margin: "0 auto",
                padding: "28px 50px 100px",
            }}
        >
            <div
                style={{
                    marginBottom: 45,
                }}
            >
                <div
                    className="mono"
                    style={{
                        fontSize: 13,
                        letterSpacing: "0.12em",
                        marginBottom: 18,
                    }}
                >
                    GOOD TO SEE YOU
                </div>

                <h1
                    className="display"
                    style={{
                        margin: 0,
                        fontSize: "clamp(72px, 11vw, 170px)",
                        lineHeight: 0.82,
                        letterSpacing: "-0.07em",
                        textTransform: "uppercase",
                        wordBreak: "break-word",
                    }}
                >
                    {firstName}.
                </h1>
            </div>

            <ProfileNav
                section={section}
                onChange={setSection}
            />

            {section === "overview" && (
                <ProfileOverview />
            )}

            {section === "schedule" && (
                <SavedPage />
            )}

            {section === "cards" && (
                <MyCards />
            )}

            {section === "settings" && (
                <SettingsPage />
            )}
        </main>
    );
}