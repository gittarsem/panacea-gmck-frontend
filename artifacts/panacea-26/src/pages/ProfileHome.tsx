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
        <div className="profile-overview">
            <section className="profile-details">
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
                        fontSize: "clamp(42px, 5vw, 72px)",
                        lineHeight: 0.9,
                        overflowWrap: "anywhere",
                    }}
                >
                    PROFILE
                </h1>

                <p className="profile-description">
                    Manage your PANACEA ’26 registrations, saved
                    events, BR Cards and account settings.
                </p>
            </section>

            <div className="profile-stats">
                <div className="profile-stat">
                    <div className="mono">
                        SAVED EVENTS
                    </div>

                    <div className="profile-stat-value display">
                        0
                    </div>
                </div>

                <div className="profile-stat">
                    <div className="mono">
                        MY CARDS
                    </div>

                    <div className="profile-stat-value display">
                        1
                    </div>
                </div>

                <div className="profile-stat">
                    <div className="mono">
                        FESTIVAL DATES
                    </div>

                    <div
                        className="profile-stat-value display profile-date-value"
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
        <main className="profile-page">
            <div className="profile-heading">
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

                <h1 className="display profile-greeting">
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