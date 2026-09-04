import { useCallback, useEffect, useRef, useState } from "react";

import { getPaymentById } from "../services/paymentService";

/**
 * usePaymentSession
 *
 * Keeps the payment pages in sync with the backend/database, which is the
 * source of truth for payment status and timing. Refreshes, new tabs, and
 * temporary offline periods cannot fake the state: every countdown/payload
 * comes from the server's `paymentSession` response.
 *
 * - Ticks the remaining-time display every second from the server-anchored
 *   `timeRemainingMs`.
 * - Re-polls the backend on an interval (default 5s) so status changes
 *   (initiated → received → success, or expiry) are picked up even if the
 *   user never acts.
 *
 * @param {String} paymentId
 * @param {Object} options
 * @param {Number} [options.pollIntervalMs=5000]
 */
const usePaymentSession = (paymentId, options = {}) => {
  const { pollIntervalMs = 5000 } = options;

  const [payment, setPayment] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [graceRemainingMs, setGraceRemainingMs] = useState(null);

  // Local anchors derived from server data (used only for the display tick).
  const graceEndAnchorRef = useRef(null);

  const syncFromServer = useCallback(
    async (silent = false) => {
      if (!paymentId) return;

      if (!silent) setLoading(true);

      try {
        const response = await getPaymentById(paymentId);
        setPayment(response.payment);
        setSession(response.paymentSession);

        const remaining = response.paymentSession?.timeRemainingMs ?? 0;
        setTimeRemainingMs(remaining);

        // Anchor the receipt-grace countdown on the server's remaining time.
        const graceMs = response.paymentSession?.receiptGraceRemainingMs ?? null;
        setGraceRemainingMs(graceMs);
        graceEndAnchorRef.current =
          graceMs !== null && graceMs > 0
            ? Date.now() + graceMs
            : null;

        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [paymentId]
  );

  useEffect(() => {
    // Schedule the initial reconciliation after this render. The backend
    // remains the source of truth; deferring avoids a synchronous state
    // update during effect setup.
    const initialSync = setTimeout(() => {
      syncFromServer(false);
    }, 0);

    // Periodic reconciliation with the backend.
    const poll = setInterval(() => syncFromServer(true), pollIntervalMs);

    // Local ticking only affects the displayed countdown, never the truth.
    const tick = setInterval(() => {
      const expiresAt = session?.expiresAt;
      if (expiresAt && ["Pending", "PaymentInitiated"].includes(session?.status)) {
        const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
        setTimeRemainingMs(remaining);
      }

      if (graceEndAnchorRef.current) {
        setGraceRemainingMs(
          Math.max(0, graceEndAnchorRef.current - Date.now())
        );
      }
    }, 1000);

    return () => {
      clearTimeout(initialSync);
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [syncFromServer, pollIntervalMs, session?.expiresAt, session?.status]);

  // Human-friendly mm:ss formatter.
  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.ceil((ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return {
    payment,
    session,
    loading,
    error,
    refresh: () => syncFromServer(false),
    timeRemainingMs,
    graceRemainingMs,
    timeRemainingLabel: formatTime(timeRemainingMs),
    graceRemainingLabel: graceRemainingMs !== null ? formatTime(graceRemainingMs) : null,
  };
};

export default usePaymentSession;
