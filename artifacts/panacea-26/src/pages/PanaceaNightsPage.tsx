import { useEffect, useState } from "react";
import "./panacea-night.css";

type Accent = "pink" | "yellow";

type ArtistReveal = {
  day: string;
  date: string;
  night: string;
  artist: string;
  event: string;
  venue: string;
  hints: string[];
  accent: Accent;
  meme?: string;
  realImage: string;
};

const reveals: ArtistReveal[] = [
  {
    day: "DAY 01",
    date: "28 OCTOBER",
    night: "PANACEA NIGHT 01",
    artist: "RAJAT SOOD",
    event: "STAND-UP COMEDY",
    venue: "Main Stage · GMC Kathua College Campus",
    meme: "/panacea-reveal-meme.png",
    realImage: "/artist-image/rajat-sood.png",
    hints: [
      "A voice that turns everyday chaos into a punchline.",
      "Known for observational comedy and sharp storytelling.",
      "Your first PANACEA Night starts with a laugh.",
    ],
    accent: "pink",
  },
  {
    day: "DAY 02",
    date: "29 OCTOBER",
    night: "PANACEA NIGHT 02",
    artist: "SWATTREX",
    event: "EDM NIGHT",
    venue: "Main Stage · GMC Kathua College Campus",
    realImage: "/artist-image/swattrex.png",
    hints: [
      "Lights down. Volume up.",
      "Expect heavy drops and a completely different campus.",
      "The second night is built for the dance floor.",
    ],
    accent: "yellow",
  },
  {
    day: "DAY 03",
    date: "30 OCTOBER",
    night: "PANACEA NIGHT 03",
    artist: "RAUHAN MALIK",
    event: "HEADLINER CONCERT",
    venue: "Main Stage · GMC Kathua College Campus",
    realImage: "/artist-image/rauhan.jpg",
    hints: [
      "One night. One stage. One voice.",
      "The biggest concert night of PANACEA ’26.",
      "The headliner takes over Day 03.",
    ],
    accent: "pink",
  },
  {
    day: "DAY 04",
    date: "31 OCTOBER",
    night: "PANACEA NIGHT 04",
    artist: "DHEERAJ MUSE",
    event: "QAWALI / SUFI NIGHT",
    venue: "Main Stage · GMC Kathua College Campus",
    realImage: "/artist-image/dheeraj.png",
    hints: [
      "Four days of chaos. We end with something soulful.",
      "A night built around voice, rhythm and emotion.",
      "PANACEA ’26 closes on a different frequency.",
    ],
    accent: "yellow",
  },
];

function SoundWave() {
  const bars = [
    22, 38, 55, 30, 72, 46, 88, 62, 96, 50, 78, 35, 65, 28, 48,
  ];

  return (
    <div className="pn-soundwave" aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={index}
          style={{
            height: `${height}%`,
            animationDelay: `${index * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}

function SpotlightVisual() {
  return (
    <div className="pn-spotlight-visual" aria-hidden="true">
      <div className="pn-spotlight-ring pn-ring-one" />
      <div className="pn-spotlight-ring pn-ring-two" />
      <div className="pn-spotlight-ring pn-ring-three" />
      <div className="pn-spotlight-core" />
      <div className="pn-spotlight-beam pn-beam-one" />
      <div className="pn-spotlight-beam pn-beam-two" />
    </div>
  );
}

function SufiVisual() {
  return (
    <div className="pn-sufi-visual" aria-hidden="true">
      <div className="pn-sufi-wave pn-sufi-wave-one" />
      <div className="pn-sufi-wave pn-sufi-wave-two" />
      <div className="pn-sufi-wave pn-sufi-wave-three" />

      <div className="pn-sufi-center">
        <span>∞</span>
      </div>

      <div className="pn-sufi-copy">
        <span>VOICE</span>
        <span>RHYTHM</span>
        <span>SOUL</span>
      </div>
    </div>
  );
}

function ComedyVisual() {
  return (
    <div className="pn-creative-visual pn-comedy-visual">
      <div className="pn-creative-top">
        <span>PANACEA ’26</span>
        <span>NIGHT / 01</span>
      </div>

      <div className="pn-comedy-circle pn-comedy-circle-one" />
      <div className="pn-comedy-circle pn-comedy-circle-two" />

      <div className="pn-comedy-mark">?</div>

      <div className="pn-comedy-copy">
        <span>GET READY</span>
        <strong>TO LAUGH.</strong>
      </div>

      <div className="pn-comedy-side">
        <span>COMEDY</span>
        <span>STAND-UP</span>
        <span>LIVE TONIGHT</span>
      </div>

      <div className="pn-comedy-bottom">
        <span>28 OCTOBER</span>
        <span>MAIN STAGE</span>
      </div>
    </div>
  );
}

function MysteryVisual({
  item,
  stage,
}: {
  item: ArtistReveal;
  stage: number;
}) {
  if (stage === 2) {
    return (
      <div className="pn-artist-image">
        <img src={item.realImage} alt={item.artist} />

        <div className="pn-image-overlay" />

        <div className="pn-image-meta">
          <span>ARTIST REVEALED</span>
          <strong>{item.artist}</strong>
        </div>
      </div>
    );
  }

  if (item.day === "DAY 01" && stage === 1 && item.meme) {
    return (
      <div className="pn-meme-visual">
        <img src={item.meme} alt="PANACEA mystery clue" />

        <div className="pn-meme-overlay">
          <span>MEME / CLUE</span>
        </div>

        <div className="pn-meme-date">
          28 OCTOBER
        </div>
      </div>
    );
  }

  if (item.day === "DAY 01") {
    return <ComedyVisual />;
  }

  if (item.day === "DAY 02") {
    return (
      <div className="pn-creative-visual pn-edm-visual">
        <div className="pn-creative-top">
          <span>PANACEA ’26</span>
          <span>NIGHT / 02</span>
        </div>

        <SoundWave />

        <div className="pn-creative-title">
          <span>TURN</span>
          <span>IT</span>
          <span>UP.</span>
        </div>

        <div className="pn-creative-tags">
          <span>AFTER DARK</span>
          <span>MAIN STAGE</span>
          <span>LIVE TONIGHT</span>
          <span>PANACEA ’26</span>
        </div>
      </div>
    );
  }

  if (item.day === "DAY 03") {
    return (
      <div className="pn-creative-visual pn-concert-visual">
        <div className="pn-creative-top">
          <span>PANACEA ’26</span>
          <span>NIGHT / 03</span>
        </div>

        <SpotlightVisual />

        <div className="pn-concert-copy">
          <span>ONE NIGHT.</span>
          <span>ONE STAGE.</span>
          <strong>ONE VOICE.</strong>
        </div>

        <div className="pn-concert-bottom">
          <span>30 OCTOBER</span>
          <span>HEADLINER NIGHT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pn-creative-visual pn-sufi-card">
      <div className="pn-creative-top">
        <span>PANACEA ’26</span>
        <span>NIGHT / 04</span>
      </div>

      <SufiVisual />

      <div className="pn-sufi-title">
        <span>VOICE.</span>
        <span>RHYTHM.</span>
        <strong>SOUL.</strong>
      </div>

      <div className="pn-creative-tags">
        <span>AFTER DARK</span>
        <span>SUFI NIGHT</span>
        <span>LIVE TONIGHT</span>
      </div>
    </div>
  );
}

function RevealButton({
  item,
  stage,
  onClick,
}: {
  item: ArtistReveal;
  stage: number;
  onClick: () => void;
}) {
  const isDayOne = item.day === "DAY 01";

  let label = "REVEAL ARTIST";

  if (isDayOne && stage === 0) {
    label = "SHOW CLUE";
  } else if (isDayOne && stage === 1) {
    label = "REVEAL ARTIST";
  } else if (stage === 2) {
    label = "HIDE ARTIST";
  }

  return (
    <button
      type="button"
      className={`pn-reveal-button ${
        stage === 2 ? "pn-reveal-button-active" : ""
      }`}
      onClick={onClick}
    >
      <span>{label}</span>

      <span className="pn-button-arrow">
        {stage === 2 ? "↙" : "→"}
      </span>
    </button>
  );
}

function getMysteryTitle(item: ArtistReveal, stage: number) {
  if (stage === 2) {
    return (
      <>
        <span>MEET</span>
        <span>{item.artist}</span>
      </>
    );
  }

  switch (item.day) {
    case "DAY 01":
      return (
        <>
          <span>GET READY</span>
          <span>TO LAUGH.</span>
        </>
      );

    case "DAY 02":
      return (
        <>
          <span>TURN IT</span>
          <span>UP.</span>
        </>
      );

    case "DAY 03":
      return (
        <>
          <span>ONE NIGHT.</span>
          <span>ONE VOICE.</span>
        </>
      );

    case "DAY 04":
      return (
        <>
          <span>VOICE.</span>
          <span>RHYTHM. SOUL.</span>
        </>
      );

    default:
      return (
        <>
          <span>THE NIGHT</span>
          <span>BEGINS.</span>
        </>
      );
  }
}

function DayContent({
  item,
  stage,
  setStage,
}: {
  item: ArtistReveal;
  stage: number;
  setStage: (value: number) => void;
}) {
  const isDayOne = item.day === "DAY 01";

  const handleReveal = () => {
    if (isDayOne) {
      setStage(stage >= 2 ? 0 : stage + 1);
      return;
    }

    setStage(stage === 2 ? 0 : 2);
  };

  return (
    <section
      className={`pn-night-content pn-accent-${item.accent}`}
      key={`${item.day}-${stage}`}
    >
      <div className="pn-night-heading">
        <div className="pn-night-heading-left">
          <span className="pn-mono">{item.night}</span>

          <h2
            key={`${item.day}-${stage}-title`}
            className="pn-stage-heading"
          >
            {getMysteryTitle(item, stage)}
          </h2>
        </div>

        <div className="pn-night-heading-right">
          <span className="pn-mono">{item.event}</span>
          <span className="pn-date">{item.date}</span>
        </div>
      </div>

      <div className="pn-reveal-layout">
        <div className="pn-visual-column">
          <div
            className={`pn-visual-frame ${
              stage === 2 ? "is-revealed" : ""
            }`}
          >
            <div
              className="pn-visual-stage"
              key={`${item.day}-visual-${stage}`}
            >
              <MysteryVisual item={item} stage={stage} />
            </div>
          </div>

          <RevealButton
            item={item}
            stage={stage}
            onClick={handleReveal}
          />
        </div>

        <aside className="pn-hints-column">
          <div className="pn-hints-header">
            <span className="pn-mono">
              {stage === 2
                ? "ARTIST / REVEALED"
                : `CLUES / ${item.day}`}
            </span>

            <span className="pn-mono">
              {stage === 2 ? "04 / 04" : "03 HINTS"}
            </span>
          </div>

          {stage === 2 ? (
            <div
              className="pn-revealed-info"
              key={`${item.day}-revealed-info`}
            >
              <div className="pn-revealed-label">
                ARTIST REVEALED
              </div>

              <h3>{item.artist}</h3>

              <div className="pn-info-row">
                <span>SHOW</span>
                <strong>{item.event}</strong>
              </div>

              <div className="pn-info-row">
                <span>DATE</span>
                <strong>{item.date}</strong>
              </div>

              <div className="pn-info-row">
                <span>VENUE</span>
                <strong>{item.venue}</strong>
              </div>
            </div>
          ) : (
            <>
              <div className="pn-hints-intro">
                <strong>THINK YOU KNOW?</strong>
                <span>FOLLOW THE CLUES.</span>
              </div>

              <div className="pn-hints-list">
                {item.hints.map((hint, index) => (
                  <div
                    className="pn-hint"
                    key={`${item.day}-${hint}`}
                  >
                    <span className="pn-hint-number">
                      HINT / 0{index + 1}
                    </span>

                    <p>{hint}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      <div className="pn-night-footer">
        <span className="pn-mono">{item.night}</span>

        <span className="pn-footer-center">
          {stage === 2
            ? `${item.artist} · ${item.event}`
            : "SELECT A NIGHT ABOVE ↑"}
        </span>

        <span className="pn-mono">
          {stage === 2 ? "REVEALED" : "MYSTERY"}
        </span>
      </div>
    </section>
  );
}

export default function PanaceaNightsPage() {
  const [activeDay, setActiveDay] = useState(0);

  const [stages, setStages] = useState<number[]>(
    reveals.map(() => 0)
  );

  const activeItem = reveals[activeDay];
  const activeStage = stages[activeDay];

  useEffect(() => {
    document.title = "PANACEA NIGHTS — PANACEA ’26";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return () => {
      document.title = "PANACEA ’26";
    };
  }, []);

  const setStage = (value: number) => {
    setStages((current) => {
      const next = [...current];
      next[activeDay] = value;
      return next;
    });
  };

  const changeDay = (index: number) => {
    setActiveDay(index);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  return (
    <main className="pn-page">
      <section className="pn-hero">
        <div className="pn-hero-bottom">
          <span className="pn-mono">
            FOUR NIGHTS · FOUR DIFFERENT WORLDS
          </span>

          <span className="pn-mono">
            SELECT A NIGHT BELOW
          </span>
        </div>
      </section>

      <nav
        className="pn-day-tabs"
        aria-label="PANACEA Nights"
      >
        {reveals.map((item, index) => (
          <button
            type="button"
            key={item.day}
            className={activeDay === index ? "active" : ""}
            onClick={() => changeDay(index)}
            aria-current={
              activeDay === index ? "page" : undefined
            }
          >
            <span className="pn-mono">{item.day}</span>
            <strong>{item.date}</strong>
          </button>
        ))}
      </nav>

      <DayContent
        key={activeItem.day}
        item={activeItem}
        stage={activeStage}
        setStage={setStage}
      />
    </main>
  );
}