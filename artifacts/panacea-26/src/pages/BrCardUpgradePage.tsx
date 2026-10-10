import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import PageTitle from "@/components/PageTitle";

export default function BrCardUpgradePage() {
    const { user } = useAuth();
    const [, setLoc] = useLocation();

    if (!user) {
        return (
            <main className="shell">
                <PageTitle
                    tag="BR Card"
                    title="LOGIN REQUIRED."
                    sub="Please login to continue."
                />

                <button
                    className="button"
                    onClick={() => setLoc("/login")}
                >
                    LOGIN
                    <ArrowRight size={15} />
                </button>
            </main>
        );
    }

    return (
        <main className="shell">
            <button
                type="button"
                onClick={() => setLoc("/profile/cards")}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    marginBottom: 30,
                    padding: 0,
                }}
            >
                <ArrowLeft size={15} />

                <span className="mono">
                    BACK TO MY CARD
                </span>
            </button>

            <PageTitle
                tag="BR Card Upgrade"
                title="UPGRADE."
                sub="Add accommodation to your PANACEA ’26 BR Card."
            />

            <div
                className="two-col"
                style={{
                    paddingBottom: 90,
                    alignItems: "start",
                }}
            >
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
                                    WebkitTextStroke:
                                        "1px var(--ink)",
                                }}
                            >
                                BR CARD
                            </span>
                        </h2>

                        <p
                            className="mono"
                            style={{
                                fontSize: 11,
                            }}
                        >
                            28—31 OCTOBER 2026
                        </p>

                        <div className="pass-bottom">
                            <div>
                                <div
                                    className="mono"
                                    style={{
                                        fontSize: 10,
                                    }}
                                >
                                    {user.fullName}
                                </div>

                                <p>
                                    {user.collegeName ||
                                        "Government Medical College Kathua"}
                                    <br />
                                    VALIDITY · 28—31 OCT 2026
                                </p>
                            </div>

                            <div
                                className="qr"
                                aria-label="BR Card QR"
                            />
                        </div>

                        <div
                            className="mono"
                            style={{
                                fontSize: 9,
                                marginTop: 21,
                            }}
                        >
                            ACCOMMODATION UPGRADE
                        </div>
                    </div>
                </div>

                <div>
                    <h2
                        className="section-title"
                        style={{
                            fontSize: 40,
                        }}
                    >
                        ADD
                        <br />
                        ACCOMMODATION.
                    </h2>

                    <div
                        className="paper-panel"
                        style={{
                            marginTop: 28,
                            padding: 24,
                            border: "1px solid var(--ink)",
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: 11,
                                marginBottom: 14,
                            }}
                        >
                            CURRENT PASS
                        </div>

                        <strong
                            style={{
                                fontSize: 22,
                            }}
                        >
                            ₹1,000 — WITHOUT ACCOMMODATION
                        </strong>
                    </div>

                    <div
                        className="paper-panel"
                        style={{
                            marginTop: 12,
                            padding: 24,
                            border: "2px solid var(--ink)",
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: 11,
                                marginBottom: 14,
                            }}
                        >
                            UPGRADED PASS
                        </div>

                        <strong
                            style={{
                                fontSize: 22,
                            }}
                        >
                            ₹1,500 — WITH ACCOMMODATION
                        </strong>

                        <p
                            style={{
                                marginTop: 10,
                                lineHeight: 1.6,
                            }}
                        >
                            Includes accommodation during PANACEA
                            ’26 along with all standard BR Card
                            access.
                        </p>
                    </div>

                    <div
                        style={{
                            marginTop: 24,
                            padding: 22,
                            border: "1px solid var(--ink)",
                        }}
                    >
                        <div
                            className="mono"
                            style={{
                                fontSize: 11,
                                marginBottom: 16,
                            }}
                        >
                            UPGRADE DIFFERENCE
                        </div>

                        <div
                            className="display"
                            style={{
                                fontSize: 54,
                                lineHeight: 1,
                            }}
                        >
                            ₹500
                        </div>

                        <div
                            style={{
                                marginTop: 20,
                                display: "grid",
                                gap: 12,
                            }}
                        >
                            {[
                                "Accommodation included",
                                "Existing BR Card retained",
                                "PANACEA ’26 access remains active",
                            ].map((item) => (
                                <div
                                    key={item}
                                    style={{
                                        display: "flex",
                                        alignItems:
                                            "flex-start",
                                        gap: 10,
                                    }}
                                >
                                    <Check
                                        size={17}
                                        style={{
                                            marginTop: 2,
                                        }}
                                    />

                                    <span>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="button"
                        onClick={() =>
                            setLoc(
                                "/br-card/payment?type=with_accommodation&upgrade=true"
                            )
                        }
                        style={{
                            width: "100%",
                            marginTop: 24,
                            justifyContent: "space-between",
                        }}
                    >
                        CONTINUE TO UPGRADE PAYMENT
                        <ArrowRight size={16} />
                    </button>

                    <div
                        className="notice"
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <strong>
                            UPGRADE PAYMENT
                        </strong>

                        <p
                            style={{
                                marginTop: 8,
                            }}
                        >
                            Pay the ₹500 accommodation upgrade
                            difference and submit your payment
                            details for verification.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}