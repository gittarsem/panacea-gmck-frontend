import { useEffect, useRef, useState } from "react";

import { Html5Qrcode } from "html5-qrcode";

import {
    adminApi,
    type BrCardVerifyResponse,
} from "@/api/adminApi";

export default function AdminScanner() {
    const [token, setToken] = useState("");

    const [result, setResult] =
        useState<BrCardVerifyResponse | null>(null);

    const [message, setMessage] = useState("");

    const [cameraOpen, setCameraOpen] = useState(false);

    const [scanning, setScanning] = useState(false);

    const [verifying, setVerifying] = useState(false);

    const scannerRef =
        useRef<Html5Qrcode | null>(null);

    const verifyingRef =
        useRef(false);

    const stopCamera = async () => {
        const scanner = scannerRef.current;

        if (!scanner) {
            setScanning(false);
            setCameraOpen(false);
            return;
        }

        try {
            if (scanner.isScanning) {
                await scanner.stop();
            }

            await scanner.clear();
        } catch {
        } finally {
            scannerRef.current = null;
            setScanning(false);
            setCameraOpen(false);
        }
    };

    const verifyToken = async (
        qrToken: string
    ) => {
        const cleanToken = qrToken.trim();

        if (!cleanToken) {
            return;
        }

        if (verifyingRef.current) {
            return;
        }

        try {
            verifyingRef.current = true;

            setVerifying(true);
            setMessage("");
            setResult(null);
            setToken(cleanToken);

            const data =
                await adminApi.verifyQr(
                    cleanToken
                );

            setResult(data);

            await stopCamera();
        } catch (error) {
            setResult(null);

            if (
                error instanceof Error &&
                error.message
            ) {
                setMessage(
                    error.message
                );
            } else {
                setMessage(
                    "INVALID OR INACTIVE BR CARD"
                );
            }
        } finally {
            verifyingRef.current = false;
            setVerifying(false);
        }
    };

    const startCamera = async () => {
        if (cameraOpen || scanning) {
            return;
        }

        try {
            setMessage("");
            setResult(null);
            setCameraOpen(true);
            setScanning(false);

            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );

            const scanner =
                new Html5Qrcode(
                    "panacea-qr-reader"
                );

            scannerRef.current = scanner;

            await scanner.start(
                {
                    facingMode:
                        "environment",
                },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250,
                    },
                },
                async (decodedText) => {
                    if (
                        verifyingRef.current
                    ) {
                        return;
                    }

                    await verifyToken(
                        decodedText
                    );
                },
                () => {}
            );

            setScanning(true);
        } catch (error) {
            scannerRef.current = null;

            setCameraOpen(false);
            setScanning(false);

            setMessage(
                "CAMERA COULD NOT BE STARTED. USE MANUAL VERIFICATION."
            );

            console.error(error);
        }
    };

    useEffect(() => {
        return () => {
            const scanner =
                scannerRef.current;

            if (!scanner) {
                return;
            }

            if (scanner.isScanning) {
                scanner
                    .stop()
                    .catch(() => {});
            }

            scanner
                .clear()
               ;

            scannerRef.current = null;
        };
    }, []);

    const resetScanner = async () => {
        await stopCamera();

        setToken("");
        setMessage("");
        setResult(null);
        setVerifying(false);
    };

    return (
        <main className="admin-scanner-page">
            <div className="scanner-header">
                <div className="mono scanner-eyebrow">
                    ENTRY CONTROL
                </div>

                <h1 className="display">
                    Scanner
                </h1>

                <p>
                    Verify active PANACEA BR Cards
                    at the festival entry.
                </p>
            </div>

            <div className="scanner-grid">
                <section className="scanner-card camera-card">
                    <div className="scanner-card-top">
                        <div>
                            <div className="mono">
                                CAMERA SCAN
                            </div>

                            <h2>
                                Scan BR Card QR
                            </h2>

                            <p>
                                Scan the visitor's
                                PANACEA BR Card QR
                                directly using the
                                device camera.
                            </p>
                        </div>

                        {scanning && (
                            <span className="scanner-live">
                                CAMERA LIVE
                            </span>
                        )}
                    </div>

                    {cameraOpen ? (
                        <div className="camera-wrapper">
                            <div
                                id="panacea-qr-reader"
                                className="qr-reader"
                            />

                            <button
                                type="button"
                                className="scanner-secondary-button"
                                onClick={
                                    stopCamera
                                }
                                disabled={
                                    verifying
                                }
                            >
                                STOP CAMERA
                            </button>
                        </div>
                    ) : (
                        <div className="camera-placeholder">
                            <div className="camera-frame">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>

                            <div className="camera-placeholder-text">
                                <strong>
                                    CAMERA READY
                                </strong>

                                <span>
                                    Allow camera
                                    access to scan
                                    BR Cards.
                                </span>
                            </div>
                        </div>
                    )}

                    {!cameraOpen && (
                        <button
                            type="button"
                            className="scanner-primary-button"
                            onClick={
                                startCamera
                            }
                            disabled={
                                verifying
                            }
                        >
                            OPEN CAMERA
                        </button>
                    )}
                </section>

                <section className="scanner-card manual-card">
                    <div className="mono">
                        MANUAL VERIFICATION
                    </div>

                    <h2>
                        Enter QR token
                    </h2>

                    <p>
                        Use this if the camera is
                        unavailable or the QR cannot
                        be scanned.
                    </p>

                    <input
                        value={token}
                        onChange={(event) =>
                            setToken(
                                event.target.value
                            )
                        }
                        placeholder="Paste QR token"
                        disabled={
                            verifying
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key ===
                                "Enter"
                            ) {
                                verifyToken(
                                    token
                                );
                            }
                        }}
                    />

                    <button
                        type="button"
                        className="scanner-primary-button"
                        onClick={() =>
                            verifyToken(token)
                        }
                        disabled={
                            !token.trim() ||
                            verifying
                        }
                    >
                        {verifying
                            ? "VERIFYING..."
                            : "VERIFY CARD"}
                    </button>
                </section>
            </div>

            {message && (
                <section className="scanner-result scanner-error">
                    <div className="mono">
                        VERIFICATION FAILED
                    </div>

                    <strong>
                        {message}
                    </strong>
                </section>
            )}

            {result && (
                <section className="scanner-result scanner-success">
                    <div className="scanner-result-heading">
                        <div>
                            <div className="mono">
                                CARD VERIFIED
                            </div>

                            <h2>
                                {result.cardId ||
                                    "BR CARD"}
                            </h2>
                        </div>

                        <span className="active-badge">
                            ACTIVE
                        </span>
                    </div>

                    <div className="scanner-result-grid">
                        <div>
                            <span className="mono">
                                PASS TYPE
                            </span>

                            <strong>
                                {result.passType ===
                                "WITH_ACCOMMODATION"
                                    ? "WITH ACCOMMODATION"
                                    : "WITHOUT ACCOMMODATION"}
                            </strong>
                        </div>

                        <div>
                            <span className="mono">
                                AMOUNT
                            </span>

                            <strong>
                                ₹{result.amount}
                            </strong>
                        </div>

                        <div>
                            <span className="mono">
                                PAYMENT
                            </span>

                            <strong>
                                {result.status}
                            </strong>
                        </div>

                        <div>
                            <span className="mono">
                                TRANSACTION
                            </span>

                            <strong>
                                {result.transactionId ||
                                    "—"}
                            </strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="scanner-secondary-button"
                        onClick={
                            resetScanner
                        }
                        style={{
                            marginTop: 20,
                        }}
                    >
                        SCAN ANOTHER CARD
                    </button>
                </section>
            )}
        </main>
    );
}