import { useEffect, useState, type ReactNode } from "react";



import {

    ArrowDown,

    ArrowRight,

} from "lucide-react";



import { useLocation } from "wouter";



import PageTitle from "../components/PageTitle";

import { useAuth } from "../context/AuthContext";
import { brCardApi } from "../api/brCardApi";



type PassType =

    | "without_accommodation"

    | "with_accommodation";



export default function BrCardPage() {

    const { user } = useAuth();

    const [, setLocation] = useLocation();



    const [termsExpanded, setTermsExpanded] =

        useState(false);



    const [termsAccepted, setTermsAccepted] =

        useState(false);



    const [passType, setPassType] =

        useState<PassType>(

            "without_accommodation"

        );

    const [checkingExistingCard, setCheckingExistingCard] =
        useState(true);

    useEffect(() => {
        let mounted = true;

        const checkExistingCard = async () => {
            if (!user) {
                if (mounted) setCheckingExistingCard(false);
                return;
            }

            try {
                const existingCard = await brCardApi.getMyBrCard();

                // Never show the purchase options again once a BR Card
                // exists. The status page handles ₹1,000 -> ₹1,500 upgrade.
                if (
                    mounted &&
                    existingCard &&
                    String(existingCard.status).toUpperCase() !== "REJECTED"
                ) {
                    setLocation("/br-card/status");
                    return;
                }
            } catch {
                // No BR Card yet (normally a 404): continue to purchase flow.
            } finally {
                if (mounted) setCheckingExistingCard(false);
            }
        };

        checkExistingCard();

        return () => {
            mounted = false;
        };
    }, [user, setLocation]);



    if (checkingExistingCard) {
        return (
            <main
                style={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                }}
            >
                <div
                    className="mono"
                    style={{
                        fontSize: 11,
                        letterSpacing: "0.08em",
                    }}
                >
                    CHECKING BR CARD STATUS...
                </div>
            </main>
        );
    }

    const price =

        passType === "with_accommodation"

            ? 1500

            : 1000;



    const passLabel =

        passType === "with_accommodation"

            ? "₹1,500 — With Accommodation"

            : "₹1,000 — Without Accommodation";



    const handleContinue = () => {

        /*

         * User must be logged in before continuing

         * to checkout.

         */

        if (!user) {

            setLocation(

                `/login?redirect=${encodeURIComponent(

                    `/br-card/checkout?type=${passType}`

                )}`

            );

            return;

        }



        /*

         * Terms & Conditions are mandatory.

         */

        if (!termsAccepted) {

            setTermsExpanded(true);

            return;

        }



        /*

         * Carry the selected pass type to checkout.

         */

        setLocation(

            `/br-card/checkout?type=${passType}`

        );

    };



    return (

        <main

            className="shell"

            style={{

                paddingBottom: 100,

            }}

        >

            {/* =====================================================

                PAGE INTRO

            \===================================================== */}



            <PageTitle

                tag="Access pass"

                title="BR CARD."

                sub="Your key to the PANACEA experience."

            />



            {/* =====================================================

                MAIN BR CARD SECTION

            \===================================================== */}



            <div

                className="br-card-layout"

                style={{

                    display: "grid",

                    gridTemplateColumns:

                        "minmax(0, 1fr) minmax(0, 1fr)",

                    gap: 52,

                    alignItems: "start",

                    paddingBottom: 90,

                }}

            >

                {/* =================================================

                    LEFT — BR CARD PREVIEW

                \================================================= */}



                <div>

                    <div

                        className="panacea-pass"

                        style={{

                            position: "relative",

                            minHeight: 510,

                            background: "#ff3f78",

                            border: "1px solid #111",

                            boxShadow:

                                "9px 9px 0 #111",

                            padding:

                                "55px 50px 35px",

                            overflow: "hidden",

                            boxSizing: "border-box",

                        }}

                    >

                        {/* BLUE DECORATIVE CIRCLE */}



                        <div

                            style={{

                                position:

                                    "absolute",

                                width: 330,

                                height: 330,

                                borderRadius: "50%",

                                border:

                                    "28px solid #21a9dc",

                                right: -145,

                                top: -155,

                                boxSizing:

                                    "border-box",

                            }}

                        />



                        {/* YELLOW DECORATIVE CIRCLE */}



                        <div

                            style={{

                                position:

                                    "absolute",

                                width: 275,

                                height: 275,

                                borderRadius: "50%",

                                border:

                                    "25px solid #f5b719",

                                right: -120,

                                top: -125,

                                boxSizing:

                                    "border-box",

                            }}

                        />



                        {/* CARD HEADER */}



                        <div

                            className="mono"

                            style={{

                                fontSize: 12,

                                letterSpacing:

                                    "0.08em",

                                position:

                                    "relative",

                                zIndex: 2,

                            }}

                        >

                            GOVERNMENT MEDICAL COLLEGE



                            <span

                                style={{

                                    marginLeft: 40,

                                }}

                            >

                                KATHUA

                            </span>

                        </div>



                        {/* CARD TITLE */}



                        <h2

                            className="display"

                            style={{

                                position:

                                    "relative",

                                zIndex: 2,

                                margin:

                                    "10px 0 0",

                                fontSize:

                                    "clamp(52px, 5vw, 78px)",

                                lineHeight: 0.82,

                                letterSpacing:

                                    "-0.06em",

                            }}

                        >

                            PANACEA

                            <br />

                            ’26

                            <br />



                            <span

                                style={{

                                    color:

                                        "#f5eddf",

                                    WebkitTextStroke:

                                        "1.5px #111",

                                }}

                            >

                                BR CARD

                            </span>

                        </h2>



                        {/* DATE */}



                        <div

                            className="mono"

                            style={{

                                position:

                                    "relative",

                                zIndex: 2,

                                fontSize: 12,

                                marginTop: 13,

                                letterSpacing:

                                    "0.05em",

                            }}

                        >

                            28—31 OCTOBER 2026

                        </div>



                        {/* BOTTOM CARD CONTENT */}



                        <div

                            className="br-card-bottom"

                            style={{

                                position:

                                    "absolute",

                                left: 50,

                                right: 50,

                                bottom: 35,

                                display: "flex",

                                alignItems:

                                    "flex-end",

                                justifyContent:

                                    "space-between",

                                gap: 30,

                            }}

                        >

                            {/* ACCOUNT DETAILS */}



                            <div>

                                <div

                                    className="mono"

                                    style={{

                                        fontSize: 10,

                                        letterSpacing:

                                            "0.07em",

                                        marginBottom: 7,

                                    }}

                                >

                                    {user?.fullName?.toUpperCase() ||

                                        "PANACEA ACCOUNT HOLDER"}

                                </div>



                                <p

                                    style={{

                                        margin: 0,

                                        fontSize: 17,

                                        lineHeight: 1.45,

                                    }}

                                >

                                    {user?.collegeName ||

                                        "College details"}



                                    <br />



                                    VALIDITY ·

                                    28—31 OCT 2026

                                </p>

                            </div>



                            {/* QR PLACEHOLDER */}



                            <div

                                style={{

                                    width: 125,

                                    height: 125,

                                    flexShrink: 0,

                                    background:

                                        "#f5eddf",

                                    border:

                                        "1px solid #111",

                                    display: "grid",

                                    placeItems:

                                        "center",

                                    position:

                                        "relative",

                                    overflow:

                                        "hidden",

                                }}

                                aria-label="BR Card QR code"

                            >

                                <div

                                    style={{

                                        width: "100%",

                                        height: "100%",

                                        backgroundImage: `

                                            linear-gradient(

                                                45deg,

                                                \#111 25%,

                                                transparent 25%

                                            ),

                                            linear-gradient(

                                                -45deg,

                                                \#111 25%,

                                                transparent 25%

                                            ),

                                            linear-gradient(

                                                45deg,

                                                transparent 75%,

                                                \#111 75%

                                            ),

                                            linear-gradient(

                                                -45deg,

                                                transparent 75%,

                                                \#111 75%

                                            )

                                        `,

                                        backgroundSize:

                                            "22px 22px",

                                        backgroundPosition:

                                            "0 0, 0 11px, 11px -11px, -11px 0px",

                                        opacity: 0.95,

                                    }}

                                />

                            </div>

                        </div>



                        {/* PASS ID */}



                        <div

                            className="mono"

                            style={{

                                position:

                                    "absolute",

                                left: 50,

                                bottom: 12,

                                fontSize: 9,

                                letterSpacing:

                                    "0.06em",

                            }}

                        >

                            PASS ID · GENERATED ON CLAIM

                        </div>

                    </div>

                </div>



                {/* =================================================

                    RIGHT — PASS DETAILS

                \================================================= */}



                <div>

                    <h2

                        className="display"

                        style={{

                            margin:

                                "5px 0 30px",

                            fontSize:

                                "clamp(40px, 4vw, 58px)",

                            lineHeight: 0.86,

                            letterSpacing:

                                "-0.055em",

                        }}

                    >

                        THE PASS

                        <br />

                        DETAILS.

                    </h2>



                    {/* =================================================

                        PRICE + PASS SELECTION

                    \================================================= */}



                    <div

                        style={{

                            padding:

                                "0 0 24px",

                            marginBottom: 22,

                            borderBottom:

                                "1px solid rgba(0,0,0,0.55)",

                        }}

                    >

                        <div

                            className="mono"

                            style={{

                                fontSize: 9,

                                letterSpacing:

                                    "0.08em",

                                marginBottom: 12,

                            }}

                        >

                            PRICE

                        </div>



                        <div

                            style={{

                                display: "grid",

                                gap: 12,

                            }}

                        >

                            {/* WITHOUT ACCOMMODATION */}



                            <label

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 14,

                                    cursor:

                                        "pointer",

                                    padding:

                                        "16px 17px",

                                    border:

                                        passType ===

                                            "without_accommodation"

                                            ? "2px solid #111"

                                            : "1px solid rgba(0,0,0,0.55)",

                                    background:

                                        passType ===

                                            "without_accommodation"

                                            ? "rgba(245,183,25,0.16)"

                                            : "transparent",

                                    boxShadow:

                                        passType ===

                                            "without_accommodation"

                                            ? "4px 4px 0 #111"

                                            : "none",

                                    transition:

                                        "all 160ms ease",

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

                                    onChange={() =>

                                        setPassType(

                                            "without_accommodation"

                                        )

                                    }

                                    style={{

                                        width: 18,

                                        height: 18,

                                        accentColor:

                                            "#111",

                                        flexShrink: 0,

                                    }}

                                />



                                <div>

                                    <div

                                        style={{

                                            fontSize: 17,

                                            fontWeight: 700,

                                            lineHeight:

                                                1.35,

                                        }}

                                    >

                                        ₹1,000 —

                                        Without

                                        Accommodation

                                    </div>



                                    <div

                                        className="mono"

                                        style={{

                                            fontSize: 9,

                                            marginTop: 6,

                                            letterSpacing:

                                                "0.06em",

                                        }}

                                    >

                                        BR CARD ·

                                        28—31 OCT

                                        2026

                                    </div>

                                </div>

                            </label>



                            {/* WITH ACCOMMODATION */}



                            <label

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 14,

                                    cursor:

                                        "pointer",

                                    padding:

                                        "16px 17px",

                                    border:

                                        passType ===

                                            "with_accommodation"

                                            ? "2px solid #111"

                                            : "1px solid rgba(0,0,0,0.55)",

                                    background:

                                        passType ===

                                            "with_accommodation"

                                            ? "rgba(245,183,25,0.16)"

                                            : "transparent",

                                    boxShadow:

                                        passType ===

                                            "with_accommodation"

                                            ? "4px 4px 0 #111"

                                            : "none",

                                    transition:

                                        "all 160ms ease",

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

                                    onChange={() =>

                                        setPassType(

                                            "with_accommodation"

                                        )

                                    }

                                    style={{

                                        width: 18,

                                        height: 18,

                                        accentColor:

                                            "#111",

                                        flexShrink: 0,

                                    }}

                                />



                                <div>

                                    <div

                                        style={{

                                            fontSize: 17,

                                            fontWeight: 700,

                                            lineHeight:

                                                1.35,

                                        }}

                                    >

                                        ₹1,500 —

                                        With

                                        Accommodation

                                    </div>



                                    <div

                                        className="mono"

                                        style={{

                                            fontSize: 9,

                                            marginTop: 6,

                                            letterSpacing:

                                                "0.06em",

                                        }}

                                    >

                                        BR CARD +

                                        ACCOMMODATION

                                    </div>

                                </div>

                            </label>

                        </div>



                        {/* SELECTED PASS */}



                        <div

                            style={{

                                marginTop: 12,

                                fontSize: 13,

                                lineHeight: 1.5,

                            }}

                        >

                            Selected:

                            {" "}

                            <strong>

                                {passLabel}

                            </strong>

                        </div>

                    </div>



                    {/* =================================================

                        VALIDITY

                    \================================================= */}



                    <PassInfo

                        label="VALIDITY"

                        value={

                            <>

                                28–31 October 2026

                                <br />

                                Valid throughout

                                PANACEA ’26

                                at Government

                                Medical College

                                Kathua.

                            </>

                        }

                    />



                    {/* =================================================

                        BENEFITS

                    \================================================= */}



                    <PassInfo

                        label="BENEFITS"

                        value={

                            <div

                                style={{

                                    display: "grid",

                                    gap: 7,

                                }}

                            >

                                <div>

                                    • Access to PANACEA

                                    ’26 events and

                                    activities

                                </div>



                                <div>

                                    • Entry to the

                                    cultural and

                                    entertainment

                                    nights

                                </div>



                                <div>

                                    • Access to sports

                                    and academic

                                    events

                                </div>



                                <div>

                                    • Participation /

                                    entry to eligible

                                    competitions and

                                    activities

                                </div>



                                <div>

                                    • Accommodation

                                    included with the

                                    ₹1,500 pass

                                </div>



                                <div>

                                    • Exclusive PANACEA

                                    ’26 BR Card

                                </div>

                            </div>

                        }

                    />



                    {/* =================================================

                        TERMS & CONDITIONS

                    \================================================= */}



                    <div

                        style={{

                            borderBottom:

                                "1px solid rgba(0,0,0,0.55)",

                            marginBottom: 22,

                        }}

                    >

                        {/* ACCORDION HEADER */}



                        <button

                            type="button"

                            onClick={() =>

                                setTermsExpanded(

                                    (previous) =>

                                        !previous

                                )

                            }

                            aria-expanded={

                                termsExpanded

                            }

                            style={{

                                width: "100%",

                                display: "flex",

                                alignItems:

                                    "center",

                                justifyContent:

                                    "space-between",

                                gap: 20,

                                border: "none",

                                background:

                                    "transparent",

                                padding:

                                    "0 0 20px",

                                cursor:

                                    "pointer",

                                color: "#111",

                                textAlign:

                                    "left",

                                fontFamily:

                                    "inherit",

                            }}

                        >

                            <div>

                                <div

                                    className="mono"

                                    style={{

                                        fontSize: 9,

                                        letterSpacing:

                                            "0.08em",

                                        marginBottom: 10,

                                    }}

                                >

                                    TERMS &

                                    CONDITIONS

                                </div>



                                <div

                                    style={{

                                        fontSize: 17,

                                        lineHeight:

                                            1.35,

                                    }}

                                >

                                    Please read and

                                    accept the terms

                                    before continuing

                                    to payment.

                                </div>

                            </div>



                            <ArrowDown

                                size={18}

                                strokeWidth={1.5}

                                style={{

                                    flexShrink: 0,

                                    transform:

                                        termsExpanded

                                            ? "rotate(180deg)"

                                            : "rotate(0deg)",

                                    transition:

                                        "transform 180ms ease",

                                }}

                            />

                        </button>



                        {/* EXPANDED TERMS */}



                        {termsExpanded && (

                            <div

                                style={{

                                    padding:

                                        "0 0 22px",

                                    fontSize: 14,

                                    lineHeight: 1.6,

                                }}

                            >

                                <div

                                    style={{

                                        display: "grid",

                                        gap: 10,

                                        marginBottom: 22,

                                    }}

                                >

                                    <div>

                                        • The BR Card is

                                        personal and

                                        non-transferable.

                                    </div>



                                    <div>

                                        • Valid

                                        registration and

                                        payment are

                                        required for

                                        confirmation.

                                    </div>



                                    <div>

                                        • Event access

                                        may be subject

                                        to venue

                                        capacity and

                                        individual event

                                        rules.

                                    </div>



                                    <div>

                                        • Accommodation

                                        is available

                                        only with the

                                        accommodation-

                                        inclusive pass.

                                    </div>



                                    <div>

                                        • PANACEA ’26

                                        reserves the

                                        right to modify

                                        the event

                                        schedule or

                                        access

                                        guidelines if

                                        required.

                                    </div>

                                </div>



                                {/* REQUIRED ACCEPTANCE */}



                                <label

                                    style={{

                                        display: "flex",

                                        alignItems:

                                            "flex-start",

                                        gap: 12,

                                        cursor:

                                            "pointer",

                                        padding:

                                            "14px 15px",

                                        border:

                                            "1px solid #111",

                                        background:

                                            termsAccepted

                                                ? "rgba(245,183,25,0.18)"

                                                : "transparent",

                                    }}

                                >

                                    <input

                                        type="checkbox"

                                        checked={

                                            termsAccepted

                                        }

                                        onChange={(

                                            event

                                        ) =>

                                            setTermsAccepted(

                                                event

                                                    .target

                                                    .checked

                                            )

                                        }

                                        style={{

                                            width: 17,

                                            height: 17,

                                            marginTop: 2,

                                            accentColor:

                                                "#111",

                                            cursor:

                                                "pointer",

                                            flexShrink: 0,

                                        }}

                                    />



                                    <span

                                        style={{

                                            fontSize: 14,

                                            lineHeight:

                                                1.45,

                                        }}

                                    >

                                        I have read and

                                        agree to the{" "}

                                        <strong>

                                            Terms &

                                            Conditions

                                        </strong>{" "}

                                        of PANACEA ’26

                                        and understand

                                        that the BR Card

                                        is personal and

                                        non-transferable.

                                    </span>

                                </label>

                            </div>

                        )}



                        {/* 

                         * Keep the checkbox visible even when

                         * the accordion is collapsed so the user

                         * always knows that acceptance is required.

                         */}



                        {!termsExpanded && (

                            <label

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "flex-start",

                                    gap: 12,

                                    cursor:

                                        "pointer",

                                    padding:

                                        "14px 15px",

                                    marginBottom: 20,

                                    border:

                                        "1px solid #111",

                                    background:

                                        termsAccepted

                                            ? "rgba(245,183,25,0.18)"

                                            : "transparent",

                                }}

                            >

                                <input

                                    type="checkbox"

                                    checked={

                                        termsAccepted

                                    }

                                    onChange={(

                                        event

                                    ) =>

                                        setTermsAccepted(

                                            event

                                                .target

                                                .checked

                                        )

                                    }

                                    style={{

                                        width: 17,

                                        height: 17,

                                        marginTop: 2,

                                        accentColor:

                                            "#111",

                                        cursor:

                                            "pointer",

                                        flexShrink: 0,

                                    }}

                                />



                                <span

                                    style={{

                                        fontSize: 14,

                                        lineHeight:

                                            1.45,

                                    }}

                                >

                                    I have read and

                                    agree to the{" "}

                                    <strong>

                                        Terms &

                                        Conditions

                                    </strong>{" "}

                                    of PANACEA ’26.

                                </span>

                            </label>

                        )}

                    </div>



                    {/* =================================================

                        CTA

                    \================================================= */}



                    <div

                        style={{

                            marginTop: 22,

                        }}

                    >

                        <button

                            type="button"

                            disabled={

                                !!user &&

                                !termsAccepted

                            }

                            onClick={

                                handleContinue

                            }

                            style={{

                                display:

                                    "inline-flex",

                                alignItems:

                                    "center",

                                gap: 12,

                                border:

                                    "1px solid #111",

                                background:

                                    user &&

                                        !termsAccepted

                                        ? "#d8d2c5"

                                        : "#ff3f78",

                                color:

                                    user &&

                                        !termsAccepted

                                        ? "#777"

                                        : "#111",

                                padding:

                                    "15px 20px",

                                boxShadow:

                                    user &&

                                        !termsAccepted

                                        ? "none"

                                        : "5px 5px 0 #111",

                                cursor:

                                    user &&

                                        !termsAccepted

                                        ? "not-allowed"

                                        : "pointer",

                                fontFamily:

                                    "inherit",

                                fontSize: 11,

                                letterSpacing:

                                    "0.07em",

                                opacity:

                                    user &&

                                        !termsAccepted

                                        ? 0.75

                                        : 1,

                            }}

                        >

                            {user

                                ? `CONTINUE TO PAYMENT · ₹${price}`

                                : "LOGIN TO CONTINUE"}



                            <ArrowRight

                                size={16}

                                strokeWidth={1.5}

                            />

                        </button>



                        {/* Terms reminder */}



                        {user &&

                            !termsAccepted && (

                                <p

                                    className="mono"

                                    style={{

                                        fontSize: 9,

                                        marginTop: 12,

                                        lineHeight: 1.6,

                                    }}

                                >

                                    PLEASE ACCEPT THE

                                    TERMS & CONDITIONS

                                    ABOVE TO CONTINUE

                                    TO PAYMENT.

                                </p>

                            )}



                        {/* Signup */}



                        {!user && (

                            <div

                                style={{

                                    marginTop: 12,

                                    fontSize: 14,

                                }}

                            >

                                <button

                                    type="button"

                                    onClick={() =>

                                        setLocation(

                                            "/signup"

                                        )

                                    }

                                    style={{

                                        border: "none",

                                        background:

                                            "transparent",

                                        padding: 0,

                                        cursor:

                                            "pointer",

                                        color: "#111",

                                        textDecoration:

                                            "underline",

                                        fontFamily:

                                            "inherit",

                                        fontSize: 14,

                                    }}

                                >

                                    Create an account

                                </button>

                            </div>

                        )}

                    </div>



                    {/* =================================================

                        PAYMENT SUPPORT

                    \================================================= */}



                    <div

                        className="notice"

                        style={{

                            marginTop: 24,

                        }}

                    >

                        <strong>

                            HAVING AN ISSUE WITH

                            PAYMENT?

                        </strong>



                        <p

                            style={{

                                marginTop: 8,

                            }}

                        >

                            If you are unable to

                            complete your payment,

                            contact the PANACEA

                            organisers for

                            assistance.

                        </p>



                        <p

                            className="mono"

                            style={{

                                fontSize: 9,

                                marginTop: 10,

                            }}

                        >

                            PAYMENT SUPPORT ·

                            CONTACT DETAILS TBA

                        </p>

                    </div>

                </div>

            </div>



            {/* =====================================================

                RESPONSIVE

            \===================================================== */}



            <style>

                {`

                    @media (max-width: 900px) {

                        .br-card-layout {

                            grid-template-columns: 1fr !important;

                            gap: 55px !important;

                        }



                        .panacea-pass {

                            min-height: 470px !important;

                        }

                    }



                    @media (max-width: 600px) {

                        .panacea-pass {

                            min-height: 560px !important;

                            padding: 35px 25px 30px !important;

                        }



                        .br-card-bottom {

                            left: 25px !important;

                            right: 25px !important;

                        }



                        .panacea-pass > .mono:last-child {

                            left: 25px !important;

                        }



                        .br-card-bottom > div:last-child {

                            width: 90px !important;

                            height: 90px !important;

                        }

                    }

                `}

            </style>

        </main>

    );

}



/* =========================================================

   PASS INFORMATION ROW

\========================================================= */



function PassInfo({

    label,

    value,

}: {

    label: string;

    value: ReactNode;

}) {

    return (

        <div

            style={{

                padding: "0 0 20px",

                marginBottom: 17,

                borderBottom:

                    "1px solid rgba(0,0,0,0.55)",

            }}

        >

            <div

                className="mono"

                style={{

                    fontSize: 9,

                    letterSpacing:

                        "0.08em",

                    marginBottom: 10,

                }}

            >

                {label}

            </div>



            <div

                style={{

                    fontSize: 17,

                    lineHeight: 1.45,

                }}

            >

                {value}

            </div>

        </div>

    );

}