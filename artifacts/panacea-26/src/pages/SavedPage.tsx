import { CalendarDays } from "lucide-react";

export default function SavedPage() {
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
          fontSize: "clamp(58px, 7vw, 96px)",
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
        Your saved PANACEA ’26 events will appear here.
        Save events from the schedule to build your
        personal festival plan.
      </p>

      <div
        style={{
          marginTop: 45,
          maxWidth: 700,
          border: "1px solid #111",
          padding: "55px 40px",
          boxShadow: "8px 8px 0 #111",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <CalendarDays size={42} strokeWidth={1.5} />

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
          Browse the PANACEA ’26 schedule and save the
          events you don't want to miss.
        </p>
      </div>
    </section>
  );
}