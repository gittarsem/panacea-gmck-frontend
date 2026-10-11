import { useEffect, useMemo, useState } from "react";

import {
  Download,
  FileSpreadsheet,
  Search,
} from "lucide-react";

import * as XLSX from "xlsx";

import {
  adminApi,
  type AdminBrCardResponse,
} from "@/api/adminApi";

const pageStyle = {
  minHeight: "100%",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box" as const,
  background: "#F6F1E7",
  color: "#24211D",
  padding: "28px",
  overflowX: "hidden" as const,
};

const panelStyle = {
  background: "#FFFDF8",
  border: "1px solid #D8CCBA",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(72,55,30,0.06)",
};

type AdminBrCardRow = AdminBrCardResponse & {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  collegeName?: string;
  city?: string;
  state?: string;
};

function valueOrDash(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return "—";
  }

  return String(value);
}

function formatPassType(value?: string) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function getDisplayName(card: AdminBrCardRow) {
  return (
    card.fullName ||
    (card as any).name ||
    `User #${valueOrDash(card.userId)}`
  );
}

function getEmail(card: AdminBrCardRow) {
  return (
    card.email ||
    (card as any).userEmail ||
    "—"
  );
}

function getPhone(card: AdminBrCardRow) {
  return (
    card.phoneNumber ||
    (card as any).phone ||
    "—"
  );
}

function getCollege(card: AdminBrCardRow) {
  return (
    card.collegeName ||
    (card as any).college ||
    "—"
  );
}

function getCity(card: AdminBrCardRow) {
  return (
    card.city ||
    "—"
  );
}

function getState(card: AdminBrCardRow) {
  return (
    card.state ||
    "—"
  );
}

export default function AdminBrCards() {
  const [activeCards, setActiveCards] = useState<
    AdminBrCardRow[]
  >([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await adminApi.getActiveBrCards();

      setActiveCards(
        (data || []) as AdminBrCardRow[]
      );
    } catch (err) {
      console.error(
        "Failed to load active BR cards:",
        err
      );

      setError(
        "Unable to load active BR Cards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await adminApi.getActiveBrCards();

        if (!mounted) return;

        setActiveCards(
          (data || []) as AdminBrCardRow[]
        );
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(
            "Unable to load active BR Cards."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCards = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return activeCards;
    }

    return activeCards.filter((card) => {
      const searchable = [
        card.cardId,
        card.brCardId,
        card.userId,
        getDisplayName(card),
        getEmail(card),
        getPhone(card),
        getCollege(card),
        getCity(card),
        getState(card),
        card.passType,
        card.transactionId,
        card.paymentStatus,
        card.expectedAmount,
        card.paymentAmount,
      ];

      return searchable
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [activeCards, search]);

  const downloadCsv = () => {
    if (!activeCards.length) return;

    const headers = [
      "Card ID",
      "BR Card Number",
      "User ID",
      "Full Name",
      "Email",
      "Phone Number",
      "College",
      "City",
      "State",
      "Pass Type",
      "Expected Amount",
      "Payment Amount",
      "Payment Status",
      "Transaction ID",
      "Submitted At",
      "Verified At",
    ];

    const rows = activeCards.map((card) => [
      card.cardId,
      card.brCardId,
      card.userId,
      getDisplayName(card),
      getEmail(card),
      getPhone(card),
      getCollege(card),
      getCity(card),
      getState(card),
      formatPassType(card.passType),
      card.expectedAmount,
      card.paymentAmount,
      card.paymentStatus,
      card.transactionId,
      card.submittedAt,
      card.verifiedAt,
    ]);

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(escapeCsv)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "panacea-2026-active-br-cards.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (!activeCards.length) return;

    const rows = activeCards.map(
      (card) => ({
        "Card ID":
          card.cardId || "",
        "BR Card Number":
          card.brCardId || "",
        "User ID":
          card.userId || "",
        "Full Name":
          getDisplayName(card),
        Email:
          getEmail(card),
        "Phone Number":
          getPhone(card),
        College:
          getCollege(card),
        City:
          getCity(card),
        State:
          getState(card),
        "Pass Type":
          formatPassType(
            card.passType
          ),
        "Expected Amount":
          card.expectedAmount ?? "",
        "Payment Amount":
          card.paymentAmount ?? "",
        "Payment Status":
          card.paymentStatus ?? "",
        "Transaction ID":
          card.transactionId ?? "",
        "Submitted At":
          card.submittedAt ?? "",
        "Verified At":
          card.verifiedAt ?? "",
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 14 },
      { wch: 10 },
      { wch: 24 },
      { wch: 30 },
      { wch: 18 },
      { wch: 30 },
      { wch: 18 },
      { wch: 20 },
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 28 },
      { wch: 24 },
      { wch: 24 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Active BR Cards"
    );

    XLSX.writeFile(
      workbook,
      "panacea-2026-active-br-cards.xlsx"
    );
  };

  return (
    <main style={pageStyle}>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .br-cards-page {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            min-width: 0;
          }

          .br-cards-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 24px;
            margin-bottom: 28px;
          }

          .br-cards-actions {
            display: flex;
            gap: 10px;
            flex-shrink: 0;
          }

          .br-cards-summary {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .br-card-table-wrap {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .br-card-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1280px;
          }

          .br-card-mobile-list {
            display: none;
          }

          .br-card-search-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
          }

          .br-card-search {
            position: relative;
            width: 320px;
            max-width: 100%;
          }

          .br-card-search input {
            width: 100%;
            height: 42px;
            padding: 0 14px 0 40px;
            border: 1px solid #D8CCBA;
            border-radius: 9px;
            background: #FBF6ED;
            color: #24211D;
            outline: none;
            font-size: 14px;
          }

          .br-card-search svg {
            position: absolute;
            left: 13px;
            top: 13px;
            color: #847A6C;
            pointer-events: none;
          }

          .br-card-mobile-item {
            border-top: 1px solid #EEE7DB;
            padding: 18px;
          }

          .br-card-mobile-title {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 15px;
          }

          .br-card-mobile-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .br-card-mobile-field {
            min-width: 0;
          }

          .br-card-mobile-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: #847A6C;
            margin-bottom: 4px;
            font-weight: 600;
          }

          .br-card-mobile-value {
            font-size: 13px;
            line-height: 1.4;
            overflow-wrap: anywhere;
          }

          .br-card-mobile-full {
            grid-column: 1 / -1;
          }

          @media (max-width: 1000px) {
            .br-cards-header {
              align-items: flex-start;
              flex-direction: column;
            }

            .br-cards-actions {
              width: 100%;
            }

            .br-cards-actions button {
              flex: 1;
              justify-content: center;
            }

            .br-card-search-row {
              align-items: stretch;
              flex-direction: column;
            }

            .br-card-search {
              width: 100%;
            }
          }

          @media (max-width: 760px) {
            .br-cards-summary {
              grid-template-columns: 1fr;
            }

            .br-card-table-wrap {
              display: none;
            }

            .br-card-mobile-list {
              display: block;
            }

            .br-cards-page {
              width: 100%;
            }
          }

          @media (max-width: 600px) {
            .br-cards-header {
              margin-bottom: 20px;
            }

            .br-cards-header h1 {
              font-size: 32px !important;
            }

            .br-cards-header p {
              font-size: 13px !important;
            }

            .br-cards-actions {
              flex-direction: column;
            }

            .br-cards-actions button {
              width: 100%;
            }

            .br-card-mobile-grid {
              grid-template-columns: 1fr;
            }

            .br-card-mobile-full {
              grid-column: auto;
            }
          }

          @media (max-width: 420px) {
            .br-card-mobile-item {
              padding: 14px;
            }

            .br-card-mobile-title {
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="br-cards-page">
        {/* HEADER */}
        <header className="br-cards-header">
          <div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                color: "#9A7135",
                marginBottom: 9,
              }}
            >
              BR CARD MANAGEMENT
            </div>

            <h1
              className="br-cards-page-title"
              style={{
                margin: 0,
                fontSize: 42,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: "-0.03em",
              }}
            >
              BR Cards
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                color: "#6F665A",
                fontSize: 14,
              }}
            >
              View and manage all issued festival BR
              Cards.
            </p>
          </div>

          <div className="br-cards-actions">
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!activeCards.length}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #CDBFA9",
                background: "#FFFDF8",
                color: "#805C2A",
                borderRadius: 9,
                padding: "11px 15px",
                cursor: activeCards.length
                  ? "pointer"
                  : "not-allowed",
                opacity: activeCards.length
                  ? 1
                  : 0.5,
              }}
            >
              <Download size={16} />
              CSV
            </button>

            <button
              type="button"
              onClick={downloadExcel}
              disabled={!activeCards.length}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #9A7135",
                background: "#9A7135",
                color: "#FFFDF8",
                borderRadius: 9,
                padding: "11px 15px",
                cursor: activeCards.length
                  ? "pointer"
                  : "not-allowed",
                opacity: activeCards.length
                  ? 1
                  : 0.5,
              }}
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: 14,
              border: "1px solid #D9AAA3",
              background: "#F8EAE7",
              color: "#8E4038",
              borderRadius: 10,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <section className="br-cards-summary">
          <div
            style={{
              ...panelStyle,
              padding: 22,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "#847A6C",
                letterSpacing: "0.1em",
              }}
            >
              ACTIVE BR CARDS
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 34,
                fontWeight: 600,
                color: "#805C2A",
              }}
            >
              {activeCards.length}
            </div>
          </div>

          <div
            style={{
              ...panelStyle,
              padding: 22,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "#847A6C",
                letterSpacing: "0.1em",
              }}
            >
              SEARCH RESULTS
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 34,
                fontWeight: 600,
              }}
            >
              {filteredCards.length}
            </div>
          </div>
        </section>

        {/* ACTIVE CARDS */}
        <section
          style={{
            ...panelStyle,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 22,
              borderBottom: "1px solid #E1D7C7",
            }}
          >
            <div className="br-card-search-row">
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "#9A7135",
                    letterSpacing: "0.1em",
                  }}
                >
                  ACTIVE CARDS
                </div>

                <h2
                  style={{
                    margin: "7px 0 0",
                    fontSize: 23,
                    fontWeight: 600,
                  }}
                >
                  Issued BR Cards
                </h2>
              </div>

              <div className="br-card-search">
                <Search size={17} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, card, email, college..."
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#847A6C",
              }}
            >
              Loading active BR Cards...
            </div>
          ) : filteredCards.length === 0 ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#847A6C",
              }}
            >
              {search
                ? "No cards match your search."
                : "No active BR Cards yet."}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="br-card-table-wrap">
                <table className="br-card-table">
                  <thead>
                    <tr
                      style={{
                        background: "#FBF6ED",
                      }}
                    >
                      {[
                        "Card",
                        "Applicant",
                        "Email",
                        "Phone",
                        "College",
                        "Location",
                        "Pass",
                        "Amount",
                        "Status",
                        "Transaction",
                        "Submitted",
                        "Verified",
                      ].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding:
                              "13px 14px",
                            textAlign: "left",
                            fontSize: 10,
                            letterSpacing:
                              "0.07em",
                            color:
                              "#847A6C",
                            fontWeight: 600,
                            whiteSpace:
                              "nowrap",
                            borderBottom:
                              "1px solid #E1D7C7",
                          }}
                        >
                          {heading.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCards.map(
                      (card) => (
                        <tr
                          key={
                            card.brCardId ??
                            card.cardId
                          }
                        >
                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                            }}
                          >
                            <div
                              className="mono"
                              style={{
                                color:
                                  "#805C2A",
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              {valueOrDash(
                                card.cardId
                              )}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                color:
                                  "#847A6C",
                                fontSize: 11,
                              }}
                            >
                              BR #
                              {valueOrDash(
                                card.brCardId
                              )}
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              minWidth: 170,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                              }}
                            >
                              {getDisplayName(
                                card
                              )}
                            </div>

                            <div
                              style={{
                                marginTop: 4,
                                fontSize: 11,
                                color:
                                  "#847A6C",
                              }}
                            >
                              User ID:{" "}
                              {valueOrDash(
                                card.userId
                              )}
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 12,
                              maxWidth: 220,
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {getEmail(card)}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 12,
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {getPhone(card)}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 12,
                              minWidth: 170,
                            }}
                          >
                            {getCollege(card)}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 12,
                              minWidth: 140,
                            }}
                          >
                            {getCity(card)}
                            {getState(card) !==
                              "—" && (
                              <>
                                {", "}
                                {getState(
                                  card
                                )}
                              </>
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatPassType(
                              card.passType
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontWeight: 600,
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatAmount(
                              card.expectedAmount
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                            }}
                          >
                            <span
                              style={{
                                display:
                                  "inline-flex",
                                padding:
                                  "5px 8px",
                                borderRadius: 6,
                                background:
                                  "#E8F3E8",
                                color:
                                  "#35653A",
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {valueOrDash(
                                card.paymentStatus
                              )}
                            </span>
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              minWidth: 180,
                            }}
                          >
                            <span
                              className="mono"
                              style={{
                                fontSize: 10,
                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {valueOrDash(
                                card.transactionId
                              )}
                            </span>
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 11,
                              whiteSpace:
                                "nowrap",
                              color:
                                "#6F665A",
                            }}
                          >
                            {formatDate(
                              card.submittedAt
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                "15px 14px",
                              borderBottom:
                                "1px solid #EEE7DB",
                              fontSize: 11,
                              whiteSpace:
                                "nowrap",
                              color:
                                "#6F665A",
                            }}
                          >
                            {formatDate(
                              card.verifiedAt
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="br-card-mobile-list">
                {filteredCards.map(
                  (card) => (
                    <article
                      key={
                        `mobile-${
                          card.brCardId ??
                          card.cardId
                        }`
                      }
                      className="br-card-mobile-item"
                    >
                      <div className="br-card-mobile-title">
                        <div>
                          <div
                            className="mono"
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color:
                                "#805C2A",
                            }}
                          >
                            {valueOrDash(
                              card.cardId
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 11,
                              color:
                                "#847A6C",
                            }}
                          >
                            BR Card #
                            {valueOrDash(
                              card.brCardId
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            padding:
                              "5px 8px",
                            borderRadius: 6,
                            background:
                              "#E8F3E8",
                            color:
                              "#35653A",
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          {valueOrDash(
                            card.paymentStatus
                          )}
                        </span>
                      </div>

                      <div className="br-card-mobile-grid">
                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            Applicant
                          </div>

                          <div
                            className="br-card-mobile-value"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {getDisplayName(
                              card
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            User ID
                          </div>

                          <div className="br-card-mobile-value">
                            {valueOrDash(
                              card.userId
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            Phone
                          </div>

                          <div className="br-card-mobile-value">
                            {getPhone(card)}
                          </div>
                        </div>

                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            Email
                          </div>

                          <div className="br-card-mobile-value">
                            {getEmail(card)}
                          </div>
                        </div>

                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            College
                          </div>

                          <div className="br-card-mobile-value">
                            {getCollege(card)}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            City
                          </div>

                          <div className="br-card-mobile-value">
                            {getCity(card)}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            State
                          </div>

                          <div className="br-card-mobile-value">
                            {getState(card)}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            Pass
                          </div>

                          <div className="br-card-mobile-value">
                            {formatPassType(
                              card.passType
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field">
                          <div className="br-card-mobile-label">
                            Amount
                          </div>

                          <div
                            className="br-card-mobile-value"
                            style={{
                              fontWeight: 700,
                            }}
                          >
                            {formatAmount(
                              card.expectedAmount
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            Transaction ID
                          </div>

                          <div
                            className="br-card-mobile-value mono"
                            style={{
                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {valueOrDash(
                              card.transactionId
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            Submitted At
                          </div>

                          <div className="br-card-mobile-value">
                            {formatDate(
                              card.submittedAt
                            )}
                          </div>
                        </div>

                        <div className="br-card-mobile-field br-card-mobile-full">
                          <div className="br-card-mobile-label">
                            Verified At
                          </div>

                          <div className="br-card-mobile-value">
                            {formatDate(
                              card.verifiedAt
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}