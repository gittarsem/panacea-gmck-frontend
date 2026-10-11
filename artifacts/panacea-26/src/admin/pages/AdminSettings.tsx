import {

    useEffect,

    useState,

} from "react";



import {

    AlertTriangle,

    Bell,

    CreditCard,

    Hotel,

    LockKeyhole,

    Megaphone,

    Power,

    Save,

    ShieldCheck,

} from "lucide-react";



import { adminApi } from "@/api/adminApi";



interface AdminSettingsState {

    festivalActive: boolean;

    brCardSalesOpen: boolean;

    accommodationUpgradeOpen: boolean;

    paymentVerificationEnabled: boolean;

    maintenanceMode: boolean;

    publicAnnouncement: string;

    announcementActive: boolean;

    primaryContact: string;

    secondaryContact: string;

}



const defaultSettings: AdminSettingsState = {

    festivalActive: true,

    brCardSalesOpen: true,

    accommodationUpgradeOpen: true,

    paymentVerificationEnabled: true,

    maintenanceMode: false,

    publicAnnouncement: "",

    announcementActive: false,

    primaryContact: "9682391837",

    secondaryContact: "9797454951",

};



export default function AdminSettings() {

    const [settings, setSettings] =

        useState<AdminSettingsState>(

            defaultSettings

        );



    const [loading, setLoading] =

        useState(true);



    const [saving, setSaving] =

        useState(false);



    const [saved, setSaved] =

        useState(false);



    const [error, setError] =
        useState("");

    const [storageMode, setStorageMode] =
        useState<"server" | "local">("server");

    const SETTINGS_STORAGE_KEY =
        "panacea_admin_operational_settings";

    const readLocalSettings = (): AdminSettingsState => {
        try {
            const raw = window.localStorage.getItem(
                SETTINGS_STORAGE_KEY
            );

            if (!raw) return defaultSettings;

            const stored =
                JSON.parse(raw) as Partial<AdminSettingsState>;

            return {
                ...defaultSettings,
                ...stored,
            };
        } catch {
            return defaultSettings;
        }
    };

    const writeLocalSettings = (
        value: AdminSettingsState
    ) => {
        try {
            window.localStorage.setItem(
                SETTINGS_STORAGE_KEY,
                JSON.stringify(value)
            );
        } catch (err) {
            console.error(
                "Failed to store admin settings locally:",
                err
            );
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await adminApi.getSettings();

                if (!mounted) return;

                const remote =
                    (data || {}) as Partial<AdminSettingsState>;

                const merged = {
                    ...defaultSettings,
                    ...remote,
                };

                setSettings(merged);
                setStorageMode("server");
                writeLocalSettings(merged);
            } catch (err) {
                console.warn(
                    "Admin settings API unavailable. Using local settings.",
                    err
                );

                if (mounted) {
                    setSettings(readLocalSettings());
                    setStorageMode("local");
                    setError("");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadSettings();

        return () => {
            mounted = false;
        };
    }, []);

    const update = <
        K extends keyof AdminSettingsState
    >(
        key: K,
        value: AdminSettingsState[K]
    ) => {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));

        setSaved(false);
        setError("");
    };

    const save = async () => {
        try {
            setSaving(true);
            setSaved(false);
            setError("");

            try {
                await adminApi.updateSettings(settings);
                setStorageMode("server");
            } catch (err) {
                console.warn(
                    "Admin settings API unavailable. Saving locally.",
                    err
                );
                setStorageMode("local");
            }

            writeLocalSettings(settings);
            setSaved(true);
        } finally {
            setSaving(false);
        }
    };

    const toggleStyle = (

        active: boolean

    ) => ({

        width: 44,

        height: 24,

        borderRadius: 20,

        border: "1px solid #CDBB9C",

        background: active

            ? "#9A7135"

            : "#DDD4C6",

        position: "relative" as const,

        cursor: "pointer",

        transition: "0.2s",

        flexShrink: 0,

    });



    const knobStyle = (

        active: boolean

    ) => ({

        position: "absolute" as const,

        top: 3,

        left: active ? 23 : 3,

        width: 16,

        height: 16,

        borderRadius: "50%",

        background: "#FFFDF8",

        transition: "0.2s",

        boxShadow:

            "0 1px 4px rgba(72, 55, 30, 0.2)",

    });



    const controlCardStyle = {

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: 20,

        padding: "18px 20px",

        border: "1px solid #E1D7C7",

        background: "#FFFDF8",

    };



    const inputStyle = {

        width: "100%",

        boxSizing: "border-box" as const,

        padding: "13px 14px",

        border: "1px solid #D8CCBA",

        borderRadius: 6,

        background: "#FFFDF8",

        color: "#24211D",

        fontSize: 13,

        outline: "none",

    };



    return (

        <div

            style={{

                maxWidth: 1200,

                paddingBottom: 60,

            }}

        >

            <header

                style={{

                    marginBottom: 32,

                }}

            >

                <div

                    className="mono"

                    style={{

                        color: "#9A7135",

                        fontSize: 10,

                        letterSpacing: "0.14em",

                        fontWeight: 900,

                    }}

                >

                    PANACEA 2026 / OPERATIONS

                </div>



                <h1

                    style={{

                        margin: "10px 0 0",

                        fontSize:

                            "clamp(40px, 6vw, 64px)",

                        fontWeight: 900,

                        letterSpacing: "-0.055em",

                        lineHeight: 0.95,

                        color: "#24211D",

                    }}

                >

                    Settings

                </h1>



                <p

                    style={{

                        margin: "15px 0 0",

                        maxWidth: 650,

                        color: "#6F665A",

                        fontSize: 14,

                        lineHeight: 1.7,

                    }}

                >

                    Control the operational state of

                    PANACEA, BR Card sales, payments and

                    public announcements.

                </p>

            </header>



            {error && (

                <div

                    style={{

                        marginBottom: 20,

                        padding: "13px 15px",

                        border:

                            "1px solid #E0B5AF",

                        borderRadius: 7,

                        background: "#F8E8E5",

                        color: "#9D4E47",

                        fontSize: 12,

                        fontWeight: 800,

                    }}

                >

                    {error}

                </div>

            )}



            <div

                style={{

                    display: "flex",

                    flexDirection: "column",

                    gap: 22,

                }}

            >

                {/* SYSTEM STATUS */}



                <section

                    style={{

                        background: "#FFFDF8",

                        border:

                            "1px solid #D8CCBA",

                        borderRadius: 10,

                        overflow: "hidden",

                        boxShadow:

                            "0 10px 30px rgba(72, 55, 30, 0.05)",

                    }}

                >

                    <div

                        style={{

                            padding: "21px 24px",

                            borderBottom:

                                "1px solid #E1D7C7",

                            background: "#FBF6ED",

                        }}

                    >

                        <div

                            className="mono"

                            style={{

                                color: "#9A7135",

                                fontSize: 10,

                                letterSpacing:

                                    "0.12em",

                                fontWeight: 900,

                            }}

                        >

                            SYSTEM STATUS

                        </div>



                        <div

                            style={{

                                marginTop: 6,

                                fontSize: 17,

                                fontWeight: 900,

                            }}

                        >

                            Festival availability

                        </div>

                    </div>



                    <div

                        style={{

                            padding: 20,

                            display: "grid",

                            gridTemplateColumns:

                                "repeat(auto-fit, minmax(300px, 1fr))",

                            gap: 12,

                        }}

                    >

                        <div

                            style={{

                                ...controlCardStyle,

                                borderColor:

                                    settings.festivalActive

                                        ? "#C9D7B6"

                                        : "#E1D7C7",

                            }}

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 13,

                                }}

                            >

                                <Power

                                    size={19}

                                    color="#9A7135"

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        Festival Active

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Control public

                                        festival availability.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "festivalActive",

                                        !settings.festivalActive

                                    )

                                }

                                style={toggleStyle(

                                    settings.festivalActive

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.festivalActive

                                    )}

                                />

                            </button>

                        </div>



                        <div

                            style={{

                                ...controlCardStyle,

                                borderColor:

                                    settings.maintenanceMode

                                        ? "#D9AAA5"

                                        : "#E1D7C7",

                            }}

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 13,

                                }}

                            >

                                <LockKeyhole

                                    size={19}

                                    color={

                                        settings.maintenanceMode

                                            ? "#B65C52"

                                            : "#9A7135"

                                    }

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        Maintenance Mode

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Temporarily restrict

                                        public activity.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "maintenanceMode",

                                        !settings.maintenanceMode

                                    )

                                }

                                style={toggleStyle(

                                    settings.maintenanceMode

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.maintenanceMode

                                    )}

                                />

                            </button>

                        </div>

                    </div>

                </section>



                {/* BR CARD OPERATIONS */}



                <section

                    style={{

                        background: "#FFFDF8",

                        border:

                            "1px solid #D8CCBA",

                        borderRadius: 10,

                        overflow: "hidden",

                        boxShadow:

                            "0 10px 30px rgba(72, 55, 30, 0.05)",

                    }}

                >

                    <div

                        style={{

                            padding: "21px 24px",

                            borderBottom:

                                "1px solid #E1D7C7",

                            background: "#FBF6ED",

                        }}

                    >

                        <div

                            className="mono"

                            style={{

                                color: "#9A7135",

                                fontSize: 10,

                                letterSpacing:

                                    "0.12em",

                                fontWeight: 900,

                            }}

                        >

                            BR CARD OPERATIONS

                        </div>



                        <div

                            style={{

                                marginTop: 6,

                                fontSize: 17,

                                fontWeight: 900,

                            }}

                        >

                            Registration & payment controls

                        </div>

                    </div>



                    <div

                        style={{

                            padding: 20,

                            display: "flex",

                            flexDirection: "column",

                            gap: 10,

                        }}

                    >

                        <div

                            style={

                                controlCardStyle

                            }

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 13,

                                }}

                            >

                                <CreditCard

                                    size={19}

                                    color="#9A7135"

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        BR Card Sales

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Allow new BR Card

                                        purchases.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "brCardSalesOpen",

                                        !settings.brCardSalesOpen

                                    )

                                }

                                style={toggleStyle(

                                    settings.brCardSalesOpen

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.brCardSalesOpen

                                    )}

                                />

                            </button>

                        </div>



                        <div

                            style={

                                controlCardStyle

                            }

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 13,

                                }}

                            >

                                <Hotel

                                    size={19}

                                    color="#9A7135"

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        Accommodation Upgrade

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Allow existing BR

                                        Card holders to

                                        upgrade.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "accommodationUpgradeOpen",

                                        !settings.accommodationUpgradeOpen

                                    )

                                }

                                style={toggleStyle(

                                    settings.accommodationUpgradeOpen

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.accommodationUpgradeOpen

                                    )}

                                />

                            </button>

                        </div>



                        <div

                            style={

                                controlCardStyle

                            }

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 13,

                                }}

                            >

                                <ShieldCheck

                                    size={19}

                                    color="#9A7135"

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        Payment Verification

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Allow admins to

                                        approve and reject

                                        submitted payments.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "paymentVerificationEnabled",

                                        !settings.paymentVerificationEnabled

                                    )

                                }

                                style={toggleStyle(

                                    settings.paymentVerificationEnabled

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.paymentVerificationEnabled

                                    )}

                                />

                            </button>

                        </div>

                    </div>

                </section>



                {/* PUBLIC ANNOUNCEMENT */}



                <section

                    style={{

                        background: "#FFFDF8",

                        border:

                            "1px solid #D8CCBA",

                        borderRadius: 10,

                        overflow: "hidden",

                        boxShadow:

                            "0 10px 30px rgba(72, 55, 30, 0.05)",

                    }}

                >

                    <div

                        style={{

                            padding: "21px 24px",

                            borderBottom:

                                "1px solid #E1D7C7",

                            background: "#FBF6ED",

                        }}

                    >

                        <div

                            className="mono"

                            style={{

                                color: "#9A7135",

                                fontSize: 10,

                                letterSpacing:

                                    "0.12em",

                                fontWeight: 900,

                            }}

                        >

                            PUBLIC COMMUNICATION

                        </div>



                        <div

                            style={{

                                marginTop: 6,

                                fontSize: 17,

                                fontWeight: 900,

                            }}

                        >

                            Festival announcement

                        </div>

                    </div>



                    <div

                        style={{

                            padding: 22,

                        }}

                    >

                        <div

                            style={{

                                display: "flex",

                                alignItems:

                                    "center",

                                justifyContent:

                                    "space-between",

                                gap: 15,

                                marginBottom: 18,

                            }}

                        >

                            <div

                                style={{

                                    display: "flex",

                                    alignItems:

                                        "center",

                                    gap: 12,

                                }}

                            >

                                <Megaphone

                                    size={19}

                                    color="#9A7135"

                                />



                                <div>

                                    <div

                                        style={{

                                            fontWeight: 900,

                                            fontSize: 13,

                                        }}

                                    >

                                        Show announcement

                                    </div>



                                    <div

                                        style={{

                                            marginTop: 4,

                                            color: "#847A6C",

                                            fontSize: 11,

                                        }}

                                    >

                                        Display a temporary

                                        message on the public

                                        website.

                                    </div>

                                </div>

                            </div>



                            <button

                                type="button"

                                onClick={() =>

                                    update(

                                        "announcementActive",

                                        !settings.announcementActive

                                    )

                                }

                                style={toggleStyle(

                                    settings.announcementActive

                                )}

                            >

                                <span

                                    style={knobStyle(

                                        settings.announcementActive

                                    )}

                                />

                            </button>

                        </div>



                        <textarea

                            value={

                                settings.publicAnnouncement

                            }

                            onChange={(event) =>

                                update(

                                    "publicAnnouncement",

                                    event.target.value

                                )

                            }

                            placeholder="Example: BR Card registrations close on 25 October at 11:59 PM."

                            rows={4}

                            style={{

                                ...inputStyle,

                                resize: "vertical",

                                lineHeight: 1.6,

                            }}

                        />

                    </div>

                </section>



                {/* CONTACT */}



                <section

                    style={{

                        background: "#FFFDF8",

                        border:

                            "1px solid #D8CCBA",

                        borderRadius: 10,

                        overflow: "hidden",

                        boxShadow:

                            "0 10px 30px rgba(72, 55, 30, 0.05)",

                    }}

                >

                    <div

                        style={{

                            padding: "21px 24px",

                            borderBottom:

                                "1px solid #E1D7C7",

                            background: "#FBF6ED",

                        }}

                    >

                        <div

                            className="mono"

                            style={{

                                color: "#9A7135",

                                fontSize: 10,

                                letterSpacing:

                                    "0.12em",

                                fontWeight: 900,

                            }}

                        >

                            OPERATIONS CONTACT

                        </div>



                        <div

                            style={{

                                marginTop: 6,

                                fontSize: 17,

                                fontWeight: 900,

                            }}

                        >

                            Support contacts

                        </div>

                    </div>



                    <div

                        style={{

                            padding: 22,

                            display: "grid",

                            gridTemplateColumns:

                                "repeat(auto-fit, minmax(260px, 1fr))",

                            gap: 18,

                        }}

                    >

                        <div>

                            <label

                                style={{

                                    display:

                                        "block",

                                    marginBottom: 8,

                                    fontSize: 10,

                                    fontWeight: 900,

                                    letterSpacing:

                                        "0.1em",

                                    color: "#756B5E",

                                }}

                            >

                                PRIMARY CONTACT

                            </label>



                            <input

                                value={

                                    settings.primaryContact

                                }

                                onChange={(event) =>

                                    update(

                                        "primaryContact",

                                        event.target.value

                                    )

                                }

                                style={

                                    inputStyle

                                }

                            />

                        </div>



                        <div>

                            <label

                                style={{

                                    display:

                                        "block",

                                    marginBottom: 8,

                                    fontSize: 10,

                                    fontWeight: 900,

                                    letterSpacing:

                                        "0.1em",

                                    color: "#756B5E",

                                }}

                            >

                                SECONDARY CONTACT

                            </label>



                            <input

                                value={

                                    settings.secondaryContact

                                }

                                onChange={(event) =>

                                    update(

                                        "secondaryContact",

                                        event.target.value

                                    )

                                }

                                style={

                                    inputStyle

                                }

                            />

                        </div>

                    </div>

                </section>



                {/* DANGER ZONE */}



                <section

                    style={{

                        background: "#FFFDF8",

                        border:

                            "1px solid #D9AAA5",

                        borderRadius: 10,

                        overflow: "hidden",

                    }}

                >

                    <div

                        style={{

                            padding: "18px 22px",

                            background: "#F8ECEA",

                            borderBottom:

                                "1px solid #E3C1BC",

                            display: "flex",

                            alignItems:

                                "center",

                            gap: 11,

                        }}

                    >

                        <AlertTriangle

                            size={18}

                            color="#B65C52"

                        />



                        <div>

                            <div

                                className="mono"

                                style={{

                                    color: "#9D4E47",

                                    fontSize: 10,

                                    fontWeight: 900,

                                    letterSpacing:

                                        "0.12em",

                                }}

                            >

                                DANGER ZONE

                            </div>



                            <div

                                style={{

                                    marginTop: 4,

                                    color: "#70443F",

                                    fontSize: 12,

                                }}

                            >

                                Use these controls only

                                when operationally required.

                            </div>

                        </div>

                    </div>



                    <div

                        style={{

                            padding: 20,

                            display: "flex",

                            alignItems:

                                "center",

                            justifyContent:

                                "space-between",

                            gap: 20,

                            flexWrap: "wrap",

                        }}

                    >

                        <div>

                            <div

                                style={{

                                    fontSize: 13,

                                    fontWeight: 900,

                                    color: "#403A32",

                                }}

                            >

                                {settings.maintenanceMode

                                    ? "Maintenance mode is ON"

                                    : "Website is operating normally"}

                            </div>



                            <div

                                style={{

                                    marginTop: 5,

                                    color: "#847A6C",

                                    fontSize: 11,

                                }}

                            >

                                {settings.maintenanceMode

                                    ? "Public activity should remain restricted until maintenance is complete."

                                    : "No emergency restrictions are currently active."}

                            </div>

                        </div>



                        <div

                            style={{

                                display: "flex",

                                alignItems:

                                    "center",

                                gap: 8,

                                color:

                                    settings.maintenanceMode

                                        ? "#B65C52"

                                        : "#728A55",

                                fontSize: 10,

                                fontWeight: 900,

                                letterSpacing:

                                    "0.08em",

                            }}

                        >

                            <span

                                style={{

                                    width: 7,

                                    height: 7,

                                    borderRadius:

                                        "50%",

                                    background:

                                        settings.maintenanceMode

                                            ? "#B65C52"

                                            : "#8DAD67",

                                }}

                            />



                            {settings.maintenanceMode

                                ? "RESTRICTED"

                                : "OPERATIONAL"}

                        </div>

                    </div>

                </section>



                {/* SAVE */}



                <div

                    style={{

                        display: "flex",

                        alignItems:

                            "center",

                        justifyContent:

                            "flex-end",

                        gap: 14,

                        paddingTop: 4,

                    }}

                >

                    {saved && (

                        <span

                            className="mono"

                            style={{

                                color: "#728A55",

                                fontSize: 10,

                                fontWeight: 900,

                                letterSpacing:

                                    "0.08em",

                            }}

                        >

                            ✓ SETTINGS SAVED{storageMode === "local" ? " LOCALLY" : ""}

                        </span>

                    )}



                    <button

                        type="button"

                        onClick={save}

                        disabled={

                            saving || loading

                        }

                        style={{

                            display: "inline-flex",

                            alignItems:

                                "center",

                            justifyContent:

                                "center",

                            gap: 8,

                            minWidth: 190,

                            padding:

                                "13px 20px",

                            border:

                                "1px solid #CDAE70",

                            borderRadius: 7,

                            background:

                                saving || loading

                                    ? "#E8DCC6"

                                    : "#EFE1C4",

                            color:

                                saving || loading

                                    ? "#948878"

                                    : "#805C2A",

                            fontSize: 10,

                            fontWeight: 900,

                            letterSpacing:

                                "0.08em",

                            cursor:

                                saving || loading

                                    ? "not-allowed"

                                    : "pointer",

                        }}

                    >

                        {saving ? (

                            "SAVING..."

                        ) : (

                            <>

                                <Save

                                    size={14}

                                />

                                SAVE CONTROLS

                            </>

                        )}

                    </button>

                </div>

            </div>

        </div>

    );

}