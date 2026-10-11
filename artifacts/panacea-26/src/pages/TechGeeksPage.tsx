import {
    ArrowLeft,
    ArrowUpRight,
    Code2,
    Github,
    Linkedin,
    Terminal,
} from "lucide-react";
import { Link } from "wouter";

export default function TechGeeksPage() {
    return (
        <main className="tech-geeks-page">
            {/* HERO */}
            <section className="tech-geeks-hero">
                <div className="tech-geeks-hero-inner">
                    <div className="tech-geeks-label mono">
                        CODE · SYSTEMS · EXPERIENCE
                    </div>

                    <h1 className="tech-geeks-title">
                        TECH
                        <span>GEEKS</span>
                    </h1>

                    <p className="tech-geeks-hero-copy">
                        The people behind the PANACEA ’26 digital
                        experience, platform and everything that keeps
                        the pixels moving.
                    </p>
                </div>
            </section>

            {/* TEAM */}
            <section className="tech-geeks-team shell">
                <div className="tech-geeks-section-heading">
                    <div className="tech-geeks-badge mono">
                        <Code2 size={15} />
                        BUILT WITH PASSION & CAFFEINE
                    </div>

                    <h2>THE PEOPLE BEHIND THE CODE.</h2>

                    <p>
                        Designed, built and shipped for PANACEA ’26.
                        Connect with the developer behind the experience.
                    </p>
                </div>

                <div className="tech-geeks-grid">
                    {/* TARSEM */}
                    <article className="tech-geek-card">
                        <div className="tech-geek-card-top">
                            <span className="tech-geek-role mono">
                                TECH GEEK
                            </span>

                            <span className="tech-geek-icon">
                                <Terminal size={17} />
                            </span>
                        </div>

                        <div className="tech-geek-divider" />

                        <div className="tech-geek-content">
                            <h3>TARSEM GULAB</h3>

                            <div className="tech-geek-title-tag mono">
                                DEVELOPER · BUILDER
                            </div>

                            <p>
                                Building products, systems and digital
                                experiences with a slightly unhealthy
                                obsession for making things work.
                            </p>
                        </div>

                        <div className="tech-geek-links">
                            <a
                                href="https://www.linkedin.com/in/tarsem-gulab/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Linkedin size={16} />
                                <span>LINKEDIN</span>
                                <ArrowUpRight size={14} />
                            </a>

                            <a
                                href="https://github.com/gittarsem"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Github size={16} />
                                <span>GITHUB</span>
                                <ArrowUpRight size={14} />
                            </a>

                        
                        </div>
                    </article>
                </div>
            </section>

            {/* NOTE */}
            <section className="tech-geeks-note shell">
                <div className="tech-geeks-note-inner">
                    <div className="tech-geeks-note-title mono">
                        PANACEA ’26 · DIGITAL INFRASTRUCTURE
                    </div>

                    <p>
                        From the first component to the final deployment,
                        PANACEA ’26 was built to make the festival feel
                        alive even before you step onto campus.
                    </p>

                    <div className="tech-geeks-stack mono">
                        <span>REACT</span>
                        <span>·</span>
                        <span>TYPESCRIPT</span>
                        <span>·</span>
                        <span>VITE</span>
                        <span>·</span>
                        <span>TAILWIND</span>
                        <span>·</span>
                        <span>SPRING BOOT</span>
                    </div>
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="tech-geeks-bottom">
                <div className="shell tech-geeks-bottom-inner">
                    <div>
                        <div className="tech-geeks-bottom-label mono">
                            PANACEA ’26 · GMC KATHUA
                        </div>

                        <h2>
                            SEE YOU
                            <br />
                            AT THE FEST.
                        </h2>
                    </div>

                    <div className="tech-geeks-bottom-actions">
                        <Link
                            href="/"
                            className="tech-geeks-button"
                        >
                            <ArrowLeft size={16} />
                            BACK TO PANACEA
                        </Link>

                        <Link
                            href="/events"
                            className="tech-geeks-button accent"
                        >
                            EXPLORE EVENTS
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}