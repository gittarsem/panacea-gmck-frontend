import {
    CalendarDays,
    Trash2,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { profileApi } from "../api/profileApi";

type SavedEvent = {
    id: number;
    eventId: number;
    savedAt: string;
};

export default function SavedPage() {

    const [savedEvents, setSavedEvents] =
        useState<SavedEvent[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const loadSavedEvents = async () => {

        try {

            setLoading(true);
            setError(null);

            const data =
                await profileApi.getSavedEvents();

            setSavedEvents(data);

        } catch (err) {

            console.error(
                "Failed to load saved events:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load saved events."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavedEvents();
    }, []);

    const removeEvent = async (
        eventId: number
    ) => {

        try {

            await profileApi.removeEvent(
                eventId
            );

            setSavedEvents(
                (current) =>
                    current.filter(
                        (event) =>
                            event.eventId !== eventId
                    )
            );

        } catch (err) {

            console.error(
                "Failed to remove saved event:",
                err
            );

            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to remove event."
            );
        }
    };

    return (
        <section>

            <div
                className="mono"
                style={{
                    fontSize: 12,
                    marginBottom: 18,
                }}
            >
                MY SCHEDULE
            </div>

            <h1
                className="display"
                style={{
                    margin: 0,
                    fontSize:
                        "clamp(58px, 7vw, 96px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.06em",
                }}
            >
                SAVED
                <br />
                EVENTS
            </h1>

            <p
                style={{
                    maxWidth: 650,
                    marginTop: 28,
                    fontSize: 17,
                    lineHeight: 1.6,
                }}
            >
                Your saved PANACEA ’26 events will
                appear here. Save events from the
                schedule to build your personal
                festival plan.
            </p>

            <div
                style={{
                    marginTop: 45,
                    maxWidth: 700,
                    border: "1px solid #111",
                    padding: "55px 40px",
                    boxShadow: "8px 8px 0 #111",
                }}
            >

                {loading ? (

                    <>
                        <CalendarDays
                            size={42}
                            strokeWidth={1.5}
                        />

                        <div
                            className="mono"
                            style={{
                                marginTop: 25,
                                fontSize: 12,
                            }}
                        >
                            LOADING SAVED EVENTS
                        </div>
                    </>

                ) : error ? (

                    <>
                        <CalendarDays
                            size={42}
                            strokeWidth={1.5}
                        />

                        <div
                            className="mono"
                            style={{
                                marginTop: 25,
                                fontSize: 12,
                            }}
                        >
                            FAILED TO LOAD
                        </div>

                        <p
                            style={{
                                marginTop: 12,
                                lineHeight: 1.6,
                            }}
                        >
                            {error}
                        </p>
                    </>

                ) : savedEvents.length === 0 ? (

                    <>
                        <CalendarDays
                            size={42}
                            strokeWidth={1.5}
                        />

                        <div
                            className="mono"
                            style={{
                                marginTop: 25,
                                fontSize: 12,
                            }}
                        >
                            NO SAVED EVENTS
                        </div>

                        <p
                            style={{
                                marginTop: 12,
                                maxWidth: 480,
                                lineHeight: 1.6,
                                fontSize: 15,
                            }}
                        >
                            Browse the PANACEA ’26
                            schedule and save the events
                            you don't want to miss.
                        </p>
                    </>

                ) : (

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                        }}
                    >

                        {savedEvents.map(
                            (savedEvent) => (

                                <div
                                    key={
                                        savedEvent.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #111",
                                        padding: 24,
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        gap: 20,
                                    }}
                                >

                                    <div>

                                        <div
                                            className="mono"
                                            style={{
                                                fontSize: 11,
                                                marginBottom:
                                                    10,
                                            }}
                                        >
                                            PANACEA ’26
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 22,
                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            EVENT #
                                            {" "}
                                            {
                                                savedEvent.eventId
                                            }
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 8,
                                                fontSize: 13,
                                                opacity:
                                                    0.65,
                                            }}
                                        >
                                            Saved{" "}
                                            {new Date(
                                                savedEvent.savedAt
                                            ).toLocaleString()}
                                        </div>

                                    </div>

                                    <button
                                        className="button paper"
                                        onClick={() =>
                                            removeEvent(
                                                savedEvent.eventId
                                            )
                                        }
                                    >
                                        REMOVE

                                        <Trash2
                                            size={15}
                                        />
                                    </button>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </section>
    );
}