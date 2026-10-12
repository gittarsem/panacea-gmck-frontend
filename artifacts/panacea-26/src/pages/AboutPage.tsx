import { useState } from "react";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { Link } from "wouter";

import {
  organizers,
  culturalOrganizers,
  sportsOrganizers,
  academicOrganizers,
} from "../data";

import "./about-page.css";

function OrganizerList({
  title,
  names,
}: {
  title: string;
  names: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`about-organizer-list ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="about-organizer-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="about-organizer-names">
          {names.split(", ").map((name) => (
            <span className="pill" key={name}>
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* HERO */}
      <section className="about-hero-simple">
        <div className="shell">
          <div className="eyebrow">
            Government Medical College · Kathua
          </div>

          <h1 className="display">
            ABOUT
            <br />
            <span>PANACEA.</span>
          </h1>

          <div className="sticker">
            CULTURE · CHAOS · CRESCENDO
          </div>

          <p className="about-hero-copy">
            PANACEA is the annual festival of Government Medical College,
            Kathua — bringing together culture, sports, academics,
            creativity and entertainment across four days.
          </p>

          <div className="about-hero-meta">
            <span>28—31 OCTOBER 2026</span>
            <span>GMC KATHUA</span>
          </div>
        </div>
      </section>

      {/* ABOUT PANACEA */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">The festival</div>

              <h2 className="section-title">
                FOUR DAYS.
                <br />
                ONE VIBE.
              </h2>
            </div>

            <p className="section-intro">
              PANACEA brings the campus together beyond the classroom —
              with competitions, performances, sports, academic
              experiences and nights built to remember.
            </p>
          </div>

          <div className="about-intro-grid">
            <div className="about-big-line">
              <span>MEDICINE</span>
              <span>MEETS</span>
              <span>EVERYTHING.</span>
            </div>

            <div className="about-intro-copy">
              <p>
                PANACEA is a celebration beyond medicine, bringing
                together culture, literature, sports, academics,
                creativity and entertainment on one grand platform.
              </p>

              <p>
                From the sports ground to the Main Stage, from academic
                halls to cultural performances, every part of the
                festival gives students a space to compete, create,
                connect and celebrate.
              </p>

              <Link className="button" href="/events">
                EXPLORE EVENTS <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GMC KATHUA */}
      <section className="section dark">
        <div className="shell">
          <div className="eyebrow">The institution</div>

          <div className="about-gmc-grid">
            <div>
              <h2 className="section-title">
                GMC
                <br />
                KATHUA.
              </h2>

              <span className="sticker">
                THE HOME OF PANACEA ’26
              </span>
            </div>

            <div className="about-gmc-copy">
              <p>
                Government Medical College, Kathua is the institution
                behind PANACEA ’26.
              </p>

              <p>
                The college was conceived in 2017 as part of Jammu &
                Kashmir's expansion of medical education and healthcare,
                with MBBS education beginning in 2019.
              </p>

              <p>
                PANACEA takes the same student community beyond
                classrooms and lecture halls — into competition,
                creativity, culture and celebration.
              </p>

              <div className="about-gmc-facts">
                <div>
                  <strong>2017</strong>
                  <span>INITIATIVE</span>
                </div>

                <div>
                  <strong>2019</strong>
                  <span>MBBS BEGINS</span>
                </div>

                <div>
                  <strong>JAMMU</strong>
                  <span>UNIVERSITY AFFILIATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEST COORDINATORS */}
      <section className="section about-coordinators">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                Who's making the festival
              </div>

              <h2 className="section-title">
                FEST
                <br />
                COORDINATORS.
              </h2>
            </div>

            <p className="section-intro">
              The people coordinating the cultural, sports and
              academic sides of PANACEA ’26.
            </p>
          </div>

          <div className="about-coordinator-grid">
            {organizers.map((organizer) => (
              <article
                className="about-coordinator"
                key={organizer.role}
              >
                <span className="mono">
                  {organizer.role}
                </span>

                <strong>{organizer.name}</strong>

                <span>{organizer.contact}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT ORGANISERS */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                The people behind the events
              </div>

              <h2 className="section-title">
                THE CREW.
              </h2>
            </div>

            <p className="section-intro">
              Event-wise organiser lists for the three major festival
              areas.
            </p>
          </div>

          <div className="about-organizer-box">
            <OrganizerList
              title="CULTURAL EVENT ORGANISERS"
              names={culturalOrganizers}
            />

            <OrganizerList
              title="SPORTS EVENT ORGANISERS"
              names={sportsOrganizers}
            />

            <OrganizerList
              title="ACADEMIC EVENT ORGANISERS"
              names={academicOrganizers}
            />
          </div>
        </div>
      </section>

      {/* FESTIVAL AREAS */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">The festival grounds</div>

              <h2 className="section-title">
                WHERE IT
                <br />
                HAPPENS.
              </h2>
            </div>

            <Link className="button paper" href="/schedule">
              VIEW SCHEDULE <ArrowRight size={15} />
            </Link>
          </div>

          <div className="about-venue-list">
            <article className="about-venue-row pink">
              <div className="about-venue-number">01</div>

              <div>
                <span className="mono">PRIME STAGE</span>
                <h3>GMC KATHUA COLLEGE CAMPUS</h3>
              </div>

              <p>
                PANACEA Nights, performances, stand-up, EDM,
                concerts and the closing Qawali / Sufi night.
              </p>

              <MapPin size={20} />
            </article>

            <article className="about-venue-row blue">
              <div className="about-venue-number">02</div>

              <div>
                <span className="mono">SPORTS ARENA</span>
                <h3>DISTRICT SPORTS STADIUM</h3>
              </div>

              <p>
                Cricket, football, badminton, basketball, table
                tennis and chess.
              </p>

              <MapPin size={20} />
            </article>

            <article className="about-venue-row yellow">
              <div className="about-venue-number">03</div>

              <div>
                <span className="mono">ACADEMIC HUB</span>
                <h3>LECTURE HALL 1 & 2</h3>
              </div>

              <p>
                MUN, Medical Quiz, Case Presentation and
                medical skill-based workshops.
              </p>

              <MapPin size={20} />
            </article>
          </div>
        </div>
      </section>

      {/* PANACEA NIGHTS */}
      <section className="section dark">
        <div className="shell">
          <div className="eyebrow">After dark</div>

          <div className="about-nights-heading">
            <h2 className="section-title">
              PANACEA
              <br />
              NIGHTS.
            </h2>

            <p>
              Four nights. Four different energies.
            </p>
          </div>

          <div className="about-night-grid">
            <div>
              <span>01 · 28 OCT</span>
              <strong>RAJAT SOOD</strong>
              <small>STAND-UP COMEDY</small>
            </div>

            <div>
              <span>02 · 29 OCT</span>
              <strong>SWATTREX</strong>
              <small>EDM NIGHT</small>
            </div>

            <div>
              <span>03 · 30 OCT</span>
              <strong>RAUHAN MALIK</strong>
              <small>HEADLINER CONCERT</small>
            </div>

            <div>
              <span>04 · 31 OCT</span>
              <strong>DHEERAJ MUSE</strong>
              <small>QAWALI / SUFI NIGHT</small>
            </div>
          </div>

          <Link className="button" href="/schedule">
            VIEW FULL SCHEDULE <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* FINAL */}
      <section className="about-final-simple">
        <div className="shell">
          <div className="eyebrow">
            PANACEA ’26 · GMC KATHUA
          </div>

          <h2 className="display">
            FOUR DAYS.
            <br />
            INFINITE
            <br />
            MEMORIES.
          </h2>

          <div className="about-final-actions">
            <Link className="button" href="/events">
              EXPLORE EVENTS <ArrowRight size={15} />
            </Link>

            <Link className="button paper" href="/br-card">
              GET BR CARD <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <div className="ticker">
        <span>
          PANACEA ’26 ★ GMC KATHUA ★ CULTURE ★ SPORTS ★
          ACADEMICS ★ PANACEA NIGHTS ★ 28—31 OCTOBER ★
        </span>
      </div>
    </main>
  );
}