import {

  ArrowLeft,

  ArrowRight,

  Check,

  Clock3,

  X,

} from "lucide-react";



import {

  useCallback,

  useEffect,

  useState,

  type CSSProperties,

} from "react";



import { useLocation } from "wouter";



import { QRCodeSVG } from "qrcode.react";



import PageTitle from "@/components/PageTitle";



import { useAuth } from "../context/AuthContext";



import {

  brCardApi,

  type BrCardResponse,

} from "../api/brCardApi";



/* =========================================================

   TYPES

   \========================================================= */



type BrCardStatusView = BrCardResponse & {

  upgradePending?: boolean | string;

};



/* =========================================================

   HELPERS

   \========================================================= */



function isWithAccommodation(

  passType?: string | null

): boolean {

  return (

    String(passType || "").toUpperCase() ===

    "WITH_ACCOMMODATION"

  );

}



function isUpgradePending(

  value?: boolean | string | null

): boolean {

  return (

    value === true ||

    String(value).toLowerCase() === "true"

  );

}



function normalizeStatus(

  status?: string | null

): string {

  return String(status || "")

    .trim()

    .toUpperCase();

}



/* =========================================================

   PAGE

   \========================================================= */

const Benefit = ({ text }: { text: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 12,
    }}
  >
    <span
      style={{
        fontSize: 16,
        lineHeight: 1.4,
      }}
    >
      ✓
    </span>

    <span
      style={{
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      {text}
    </span>
  </div>
);

export default function BrCardStatusPage() {

  const [, setLocation] = useLocation();



  const { user } = useAuth();



  const [brCard, setBrCard] =

    useState<BrCardStatusView | null>(null);



  const [loading, setLoading] =

    useState(true);



  const [error, setError] =

    useState("");



  /* =======================================================

     LOAD BR CARD

     \======================================================= */



  const loadBrCard = useCallback(

    async () => {

      if (!user) {

        setLoading(false);

        return;

      }



      try {

        setLoading(true);

        setError("");



        const card =

          await brCardApi.getMyBrCard();



        /*

         * IMPORTANT

         *

         * Always take upgradePending from

         * the backend.

         *

         * Do NOT calculate it from localStorage.

         */

        setBrCard(

          card as BrCardStatusView

        );

      } catch (err) {

        setError(

          err instanceof Error

            ? err.message

            : "Unable to load BR Card."

        );

      } finally {

        setLoading(false);

      }

    },

    [user]

  );



  /* =======================================================

     INITIAL LOAD

     \======================================================= */



  useEffect(() => {

    loadBrCard();

  }, [loadBrCard]);



  /* =======================================================

     NOT LOGGED IN

     \======================================================= */



  if (!user) {

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

          style={{

            maxWidth: 500,

            width: "100%",

            textAlign: "center",

          }}

        >

          <div

            className="mono"

            style={{

              fontSize: 11,

              marginBottom: 20,

            }}

          >

            BR CARD / AUTHENTICATION

          </div>



          <h1

            className="display"

            style={{

              fontSize:

                "clamp(48px, 8vw, 90px)",

              lineHeight: 0.9,

              margin: 0,

            }}

          >

            LOGIN

          </h1>



          <p

            style={{

              marginTop: 24,

              lineHeight: 1.6,

              opacity: 0.75,

            }}

          >

            Please login to view your BR

            Card status.

          </p>



          <button

            onClick={() =>

              setLocation("/login")

            }

            style={{

              marginTop: 30,

              padding: "14px 22px",

              border:

                "1px solid currentColor",

              background: "transparent",

              cursor: "pointer",

              display: "inline-flex",

              alignItems: "center",

              gap: 10,

            }}

          >

            LOGIN

            <ArrowRight size={16} />

          </button>

        </div>

      </main>

    );

  }



  /* =======================================================

     LOADING

     \======================================================= */



  if (loading) {

    return (

      <main

        style={{

          minHeight: "70vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

        }}

      >

        <div

          className="mono"

          style={{

            fontSize: 11,

            letterSpacing: "0.08em",

          }}

        >

          LOADING BR CARD...

        </div>

      </main>

    );

  }



  /* =======================================================

     ERROR

     \======================================================= */



  if (error) {

    return (

      <main

        style={{

          minHeight: "70vh",

          padding: "40px 20px",

        }}

      >

        <PageTitle

          tag="BR CARD / ERROR"

          title="ERROR"

          sub="We could not load your BR Card."

        />



        <div

          style={{

            maxWidth: 650,

            padding: 24,

            border:

              "1px solid rgba(0,0,0,0.15)",

          }}

        >

          <p

            style={{

              margin: 0,

              lineHeight: 1.6,

            }}

          >

            {error}

          </p>



          <button

            onClick={loadBrCard}

            style={{

              marginTop: 24,

              padding: "12px 18px",

              border:

                "1px solid currentColor",

              background: "transparent",

              cursor: "pointer",

            }}

          >

            TRY AGAIN

          </button>

        </div>

      </main>

    );

  }



  /* =======================================================

     NO CARD

     \======================================================= */



  if (!brCard) {

    return (

      <main

        style={{

          minHeight: "70vh",

          padding: "40px 20px",

        }}

      >

        <PageTitle

          tag="PANACEA ’26 / BR CARD"

          title="GET YOUR BR CARD"

          sub="Your BR Card registration has not been completed yet."

        />



        <button

          onClick={() =>

            setLocation("/br-card")

          }

          style={{

            marginTop: 10,

            padding: "14px 22px",

            border:

              "1px solid currentColor",

            background: "transparent",

            cursor: "pointer",

            display: "inline-flex",

            alignItems: "center",

            gap: 10,

          }}

        >

          GET BR CARD

          <ArrowRight size={16} />

        </button>

      </main>

    );

  }

  const quickLinkStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid rgba(0,0,0,0.18)",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    textAlign: "left",
    boxSizing: "border-box",
  };

  const supportButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "15px 18px",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    textAlign: "left",
    boxSizing: "border-box",
  };

  const status =

    normalizeStatus(brCard.status);



  /*

   * Backend is authoritative.

   */

  const withAccommodation =

    isWithAccommodation(

      brCard.passType

    );



  const upgradePending =

    isUpgradePending(

      brCard.upgradePending

    );



  /* =======================================================

     PAYMENT PENDING

     \======================================================= */



  if (

    status === "PAYMENT_PENDING"

  ) {

    const organiserEmail =

      "aryeenpunj@gmail.com";



    const transactionId =

      brCard.transactionId ||

      "Submitted";



    const mailSubject =

      encodeURIComponent(

        "PANACEA '26 BR Card Payment Verification Pending"

      );



    const mailBody = encodeURIComponent(
      `Hello PANACEA '26 Team,

My BR Card payment is still pending verification.

Transaction ID: ${transactionId}
Amount: ₹${brCard.amount}
Pass: ${withAccommodation
        ? "With Accommodation"
        : "Without Accommodation"
      }

Please check and verify my payment.

Thank you.`
    );

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(organiserEmail)}` +
      `&su=${mailSubject}` +
      `&body=${mailBody}`;

    return (

      <main

        style={{

          minHeight:

            "calc(100vh - 70px)",

          padding:

            "70px 20px 100px",

          display: "flex",

          justifyContent:

            "center",

        }}

      >

        <div

          style={{

            width: "100%",

            maxWidth: 820,

            margin: "0 auto",

          }}

        >

          <div

            style={{

              textAlign: "center",

            }}

          >

            <PageTitle

              tag="PANACEA ’26 / BR CARD"

              title="PAYMENT PENDING"

              sub="Your payment proof has been submitted successfully. Our team is reviewing it and will update your BR Card once verification is complete."

            />

          </div>



          <div

            style={{

              marginTop: 45,

              border:

                "1px solid rgba(0,0,0,0.15)",

              padding:

                "34px clamp(20px, 4vw, 44px)",

            }}

          >

            <div

              style={{

                display: "flex",

                alignItems: "center",

                justifyContent:

                  "center",

                gap: 12,

                marginBottom: 30,

                textAlign: "center",

              }}

            >

              <Clock3 size={22} />



              <div>

                <div

                  className="mono"

                  style={{

                    fontSize: 10,

                    marginBottom: 5,

                  }}

                >

                  PAYMENT STATUS

                </div>



                <strong>

                  VERIFICATION PENDING

                </strong>

              </div>

            </div>



            <div

              style={{

                display: "grid",

                gap: 16,

              }}

            >

              <DetailRow

                label="PASS"

                value={

                  withAccommodation

                    ? "With Accommodation"

                    : "Without Accommodation"

                }

              />



              <DetailRow

                label="AMOUNT"

                value={`₹${brCard.amount}`}

              />



              <DetailRow

                label="TRANSACTION ID"

                value={transactionId}

              />



              <DetailRow

                label="STATUS"

                value="PAYMENT PENDING"

              />

            </div>



            <div

              style={{

                marginTop: 28,

                paddingTop: 22,

                borderTop:

                  "1px solid rgba(0,0,0,0.12)",

                textAlign: "center",

                fontSize: 13,

                lineHeight: 1.65,

                opacity: 0.72,

              }}

            >

              Payment verification is done

              manually by the PANACEA ’26

              organising team. You do not

              need to submit the payment again

              while this status is pending.

            </div>



            <div

              style={{

                display: "flex",

                justifyContent:

                  "center",

                marginTop: 26,

              }}

            >

              <button

                onClick={loadBrCard}

                style={{

                  padding: "13px 22px",

                  border:

                    "1px solid currentColor",

                  background:

                    "transparent",

                  cursor: "pointer",

                  fontSize: 12,

                  fontWeight: 600,

                }}

              >

                REFRESH STATUS

              </button>

            </div>



            <div

              style={{

                marginTop: 30,

                paddingTop: 25,

                borderTop:

                  "1px solid rgba(0,0,0,0.12)",

              }}

            >

              <div

                className="mono"

                style={{

                  fontSize: 10,

                  marginBottom: 9,

                  textAlign: "center",

                }}

              >

                NEED HELP?

              </div>



              <p

                style={{

                  margin: 0,

                  textAlign: "center",

                  fontSize: 13,

                  lineHeight: 1.6,

                  opacity: 0.7,

                }}

              >

                If your payment has not been

                approved yet, contact the

                PANACEA ’26 organising team

                with your transaction ID.

              </p>



              <div

                style={{

                  display: "flex",

                  justifyContent:

                    "center",

                  flexWrap: "wrap",

                  gap: 10,

                  marginTop: 18,

                }}

              >

                <a

                  href={`mailto:${organiserEmail}?subject=${mailSubject}&body=${mailBody}`}

                  style={supportButtonStyle}

                >

                  EMAIL ORGANISER

                </a>



                <a

                  href={gmailUrl}

                  target="_blank"

                  rel="noopener noreferrer"

                  style={{

                    ...supportButtonStyle,

                    border:

                      "1px solid rgba(0,0,0,0.18)",

                  }}

                >

                  OPEN GMAIL

                </a>



                <button

                  onClick={() =>

                    setLocation("/br-card")

                  }

                  style={{

                    ...supportButtonStyle,

                    background:

                      "transparent",

                    cursor: "pointer",

                  }}

                >

                  BACK TO BR CARD

                </button>

              </div>

            </div>

          </div>



          <div

            style={{

              display: "grid",

              gridTemplateColumns:

                "repeat(auto-fit, minmax(150px, 1fr))",

              gap: 10,

              marginTop: 14,

            }}

          >

            <button

              onClick={() =>

                setLocation("/br-card")

              }

              style={quickLinkStyle}

            >

              BR CARD

            </button>



            <button

              onClick={() =>

                setLocation("/events")

              }

              style={quickLinkStyle}

            >

              EVENTS

            </button>



            <button

              onClick={() =>

                setLocation("/")

              }

              style={quickLinkStyle}

            >

              HOME

            </button>

          </div>

        </div>

      </main>

    );

  }



  /* =======================================================

     REJECTED

     \======================================================= */



  if (status === "REJECTED") {

    return (

      <main

        style={{

          minHeight: "70vh",

          padding: "40px 20px 80px",

        }}

      >

        <PageTitle

          tag="PANACEA ’26 / BR CARD"

          title="REJECTED"

          sub="Your payment could not be verified."

        />



        <div

          style={{

            maxWidth: 700,

            border:

              "1px solid rgba(0,0,0,0.15)",

            padding: 30,

          }}

        >

          <div

            style={{

              display: "flex",

              alignItems: "center",

              gap: 14,

            }}

          >

            <X size={25} />



            <strong>

              PAYMENT REJECTED

            </strong>

          </div>



          {brCard.rejectionReason && (

            <div

              style={{

                marginTop: 25,

                padding: 18,

                border:

                  "1px solid rgba(0,0,0,0.12)",

              }}

            >

              <div

                className="mono"

                style={{

                  fontSize: 10,

                  marginBottom: 8,

                }}

              >

                REASON

              </div>



              <p

                style={{

                  margin: 0,

                  lineHeight: 1.6,

                  overflowWrap:

                    "anywhere",

                }}

              >

                {brCard.rejectionReason}

              </p>

            </div>

          )}



          <button

            onClick={() =>
              setLocation(
                `/br-card/payment?type=${withAccommodation
                  ? "with_accommodation"
                  : "without_accommodation"
                }`
              )
            }

            style={{

              marginTop: 28,

              padding: "14px 22px",

              border:

                "1px solid currentColor",

              background: "transparent",

              cursor: "pointer",

              display: "inline-flex",

              alignItems: "center",

              gap: 10,

            }}

          >

            SUBMIT PAYMENT AGAIN

            <ArrowRight size={16} />

          </button>

        </div>

      </main>

    );

  }



  /* =======================================================

     ACTIVE CARD

     \======================================================= */



  return (

    <ActiveBrCard

      brCard={brCard}

      onBack={() =>

        setLocation("/")

      }

      onUpgrade={() =>

        setLocation(

          "/br-card/payment?upgrade=true&type=with_accommodation"

        )

      }

      onRefresh={loadBrCard}

    />

  );

}



/* =========================================================

   ACTIVE BR CARD

   \========================================================= */



function ActiveBrCard({

  brCard,

  onBack,

  onUpgrade,

  onRefresh,

}: {

  brCard: BrCardStatusView;

  onBack: () => void;

  onUpgrade: () => void;

  onRefresh: () => Promise<void>;

}) {

  const withAccommodation =

    isWithAccommodation(

      brCard.passType

    );



  const upgradePending =

    isUpgradePending(

      brCard.upgradePending

    );



  return (

    <main

      style={{

        minHeight: "70vh",
        padding:
          "clamp(24px, 5vw, 40px) clamp(14px, 4vw, 20px) 70px",
        overflowX: "hidden",

      }}

    >

      <div

        style={{

          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          minWidth: 0,

        }}

      >

        <PageTitle

          tag="PANACEA ’26 / BR CARD"

          title="YOUR BR CARD"

          sub="Your PANACEA ’26 BR Card is active and ready to use."

        />



        <div

          style={{

            display: "grid",

            gridTemplateColumns:

              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",

            gap: 30,

            alignItems: "stretch",

          }}

        >

          {/* =================================================

              QR

          \================================================== */}



          <div

            style={{

              border:

                "1px solid rgba(0,0,0,0.18)",

              padding: "clamp(20px, 4vw, 32px)",
              display: "flex",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",

              flexDirection: "column",

              alignItems: "center",

              justifyContent: "center",

            }}

          >

            <div

              className="mono"

              style={{

                fontSize: 11,

                marginBottom: 20,

              }}

            >

              SCAN FOR VERIFICATION

            </div>



            {brCard.qrToken ? (

              <div

                style={{

                  background: "#fff",
                  padding: "clamp(8px, 2.5vw, 18px)",
                  border:
                    "1px solid rgba(0,0,0,0.12)",
                  width: "min(100%, 266px)",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                }}

              >

                <QRCodeSVG
                  value={brCard.qrToken}
                  size={230}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: 230,
                  }}
                  level="M"
                />

              </div>

            ) : (

              <div

                style={{

                  width: "min(100%, 266px)",
                  aspectRatio: "1 / 1",
                  boxSizing: "border-box",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  border:

                    "1px solid rgba(0,0,0,0.12)",

                  textAlign: "center",

                  padding: 20,

                }}

              >

                QR CODE UNAVAILABLE

              </div>

            )}



            <div

              style={{

                textAlign: "center",

                marginTop: 25,

              }}

            >

              <div

                style={{

                  fontSize: 16,

                  fontWeight: 600,

                }}

              >

                BR Card Active

              </div>



              <p

                style={{

                  marginTop: 8,

                  marginBottom: 0,

                  fontSize: 13,

                  lineHeight: 1.5,

                  opacity: 0.7,

                }}

              >

                Show this QR code at designated

                PANACEA ’26 entry points.

              </p>

            </div>



            {/* =================================================

                UPGRADE BUTTON

            \================================================== */}



            {!withAccommodation &&

              !upgradePending && (

                <button

                  onClick={onUpgrade}

                  style={{

                    width: "100%",

                    marginTop: 30,

                    padding: "15px 18px",

                    border:

                      "1px solid currentColor",

                    background:

                      "transparent",

                    cursor: "pointer",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                    boxSizing: "border-box",


                  }}

                >

                  <span>

                    UPGRADE TO

                    ACCOMMODATION · ₹500

                  </span>



                  <ArrowRight size={17} />

                </button>

              )}



            {/* =================================================

                UPGRADE PENDING

            \================================================== */}



            {!withAccommodation &&

              upgradePending && (

                <div

                  style={{

                    width: "100%",

                    marginTop: 30,

                    padding:

                      "15px 18px",

                    border:

                      "1px solid rgba(0,0,0,0.18)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                      "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    boxSizing: "border-box",


                  }}

                >

                  <div

                    style={{

                      minWidth: 0,

                    }}

                  >

                    <div

                      style={{

                        fontSize: 14,

                        fontWeight: 600,

                      }}

                    >

                      ACCOMMODATION

                      UPGRADE

                    </div>



                    <div

                      className="mono"

                      style={{

                        fontSize: 9,

                        marginTop: 5,

                        opacity: 0.65,

                      }}

                    >

                      ₹500 PAYMENT

                      SUBMITTED

                    </div>

                  </div>



                  <span

                    className="mono"

                    style={{

                      fontSize: 9,

                      whiteSpace: "nowrap",

                    }}

                  >

                    PENDING

                  </span>

                </div>

              )}



            {/* =================================================

                REFRESH

            \================================================== */}



            {!withAccommodation &&

              upgradePending && (

                <button

                  onClick={onRefresh}

                  style={{

                    marginTop: 12,

                    padding: "8px 0",

                    border: "none",

                    background:

                      "transparent",

                    cursor: "pointer",

                    fontSize: 11,

                    opacity: 0.65,

                  }}

                >

                  REFRESH STATUS

                </button>

              )}

          </div>




          {/* =================================================

              CARD INFORMATION

          \================================================== */}



          <div

            style={{

              border:

                "1px solid rgba(0,0,0,0.18)",

              padding: "clamp(20px, 4vw, 32px)",
              minHeight: 500,
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",

              display: "flex",

              flexDirection: "column",

              justifyContent:

                "space-between",

            }}

          >

            <div>

              <div

                className="mono"

                style={{

                  fontSize: 11,

                  marginBottom: 25,

                }}

              >

                PANACEA ’26 / ACTIVE

              </div>



              <div

                className="display"

                style={{

                  fontSize:

                    "clamp(52px, 7vw, 100px)",

                  lineHeight: 0.9,

                }}

              >

                BR

                <br />

                CARD

              </div>



              <div

                style={{

                  marginTop: 40,

                }}

              >

                <div

                  className="mono"

                  style={{

                    fontSize: 10,

                    marginBottom: 8,

                  }}

                >

                  CARD ID

                </div>



                <div

                  style={{

                    fontSize:
                      "clamp(18px, 4vw, 28px)",
                    fontWeight: 600,
                    letterSpacing:
                      "0.04em",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    minWidth: 0,
                    maxWidth: "100%",

                  }}

                >

                  {brCard.cardId ||

                    "PENDING"}

                </div>

              </div>

            </div>



            <div

              style={{

                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: 25,
                minWidth: 0,

                marginTop: 50,

              }}

            >

              <div>

                <div

                  className="mono"

                  style={{

                    fontSize: 10,

                    marginBottom: 8,

                  }}

                >

                  PASS TYPE

                </div>



                <div

                  style={{

                    fontSize:
                      "clamp(14px, 2.5vw, 17px)",
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",

                  }}

                >

                  {withAccommodation

                    ? "WITH ACCOMMODATION"

                    : "WITHOUT ACCOMMODATION"}

                </div>

              </div>



              <div>

                <div

                  className="mono"

                  style={{

                    fontSize: 10,

                    marginBottom: 8,

                  }}

                >

                  AMOUNT

                </div>



                <div

                  style={{

                    fontSize:
                      "clamp(14px, 2.5vw, 17px)",
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",

                  }}

                >

                  ₹{brCard.amount}

                </div>

              </div>

            </div>



            <div

              style={{

                marginTop: 35,

                paddingTop: 22,

                borderTop:

                  "1px solid rgba(0,0,0,0.12)",

                display: "flex",

                alignItems: "center",

                gap: 10,

              }}

            >

              <Check size={17} />



              <span

                className="mono"

                style={{

                  fontSize: 11,

                }}

              >

                ACTIVE / VALID

                28–31 OCTOBER 2026

              </span>

            </div>

          </div>




        </div>

        {/* =================================================

            BENEFITS

        \================================================== */}



        <div

          style={{

            marginTop: 50,

            maxWidth: 750,

          }}

        >

          <div

            className="mono"

            style={{

              fontSize: 11,

              marginBottom: 20,

            }}

          >

            YOUR BR CARD INCLUDES

          </div>



          <Benefit text="Access to PANACEA ’26 events and activities" />



          <Benefit text="Entry to cultural and entertainment nights" />



          <Benefit text="Access to sports and academic events" />



          <Benefit text="Participation/entry to eligible competitions and activities" />



          {upgradePending && (

            <div

              style={{

                marginTop: 18,

                padding: 16,

                border:

                  "1px solid rgba(0,0,0,0.12)",

                fontSize: 13,

                lineHeight: 1.6,

              }}

            >

              <strong>

                ACCOMMODATION UPGRADE UNDER

                VERIFICATION

              </strong>



              <div

                style={{

                  marginTop: 6,

                  opacity: 0.7,

                }}

              >

                Your existing BR Card remains

                active. The ₹500 accommodation

                upgrade payment is being verified

                by the organising team.

              </div>

            </div>

          )}

        </div>



        {/* =================================================

            BACK

        \================================================== */}



        <button

          onClick={onBack}

          style={{

            marginTop: 45,

            padding: "12px 0",

            border: "none",

            background: "transparent",

            cursor: "pointer",

            display: "inline-flex",

            alignItems: "center",

            gap: 10,

          }}

        >

          <ArrowLeft size={16} />

          BACK TO HOME

        </button>

      </div>

    </main>

  );

}



/* =========================================================

   DETAIL ROW

   \========================================================= */



function DetailRow({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div

      style={{

        display: "flex",

        justifyContent:

          "space-between",

        gap: 20,

        paddingBottom: 15,

        borderBottom:

          "1px solid rgba(0,0,0,0.08)",

      }}

    >

      <span

        className="mono"

        style={{

          fontSize: 10,

          opacity: 0.65,

          flexShrink: 0,

        }}

      >

        {label}

      </span>



      <span

        style={{

          fontWeight: 600,

          textAlign: "right",

          overflowWrap:

            "anywhere",

          minWidth: 0,

        }}

      >

        {value}

      </span>

    </div>

  );

}
