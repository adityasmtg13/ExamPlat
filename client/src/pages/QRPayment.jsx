import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaInfoCircle,
  FaLock,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";

import usePaymentSession from "../hooks/usePaymentSession";
import PaymentStatusScreen from "../components/PaymentStatusScreen";
import { qrLogin } from "../services/authService";
import { getToken, setStudent, setToken } from "../storage";

/**
 * Dedicated payment page opened when the UPI QR code is scanned.
 *
 * The QR URL carries:
 *   - the payment ID (path), and
 *   - a short-lived, signed login token (`?login=...`) issued when the
 *     payment was created (see paymentController.createPayment).
 *
 * Scanning the QR therefore logs the device in automatically
 * (POST /api/auth/qr-login) and jumps straight to the UPI PIN step — no
 * credentials are typed. When no token is present and nobody is signed in,
 * the visitor is redirected to the normal login page.
 *
 * The payment record and live session state are loaded from the database
 * (ownership is verified by the backend). The UI is driven entirely by the
 * backend status:
 *
 *   Pending            → payment info + countdown + "Proceed to Payment"
 *   PaymentInitiated   → processing (attempt in progress)
 *   PaymentReceived    → received; receipt being generated (1-min grace)
 *   Success            → existing success page
 *   Expired / Failed   → clear failure screens with refund messaging
 */
const QRPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId } = useParams();
  const [searchParams] = useSearchParams();

  // The QR code embeds a short-lived login token that lets the scanning
  // device sign in automatically and go straight to the UPI PIN step.
  const loginToken = searchParams.get("login");

  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState(null);

  const { payment, loading, error, refresh, timeRemainingLabel } =
    usePaymentSession(paymentId);

  // QR scanned → exchange the embedded token for a session, then jump
  // directly to the PIN (passcode) entry page.
  useEffect(() => {
    if (!loginToken) return;

    const autoSignIn = async () => {
      try {
        setSigningIn(true);

        const response = await qrLogin({ token: loginToken, paymentId });

        if (!response.success) {
          throw new Error(response.message || "Sign-in failed.");
        }

        setToken(response.token);
        setStudent(response.student);

        // replace: true drops the login token from the URL bar.
        navigate(`/payment/scan/${paymentId}/passcode`, { replace: true });
      } catch (err) {
        setSignInError(
          err.message ||
            "We could not sign you in automatically. Please log in manually."
        );
        setSigningIn(false);
      }
    };

    autoSignIn();
  }, [loginToken, paymentId, navigate]);

  // When the payment reaches Success (e.g. the user returns to this link
  // after the grace period), continue into the existing success flow.
  useEffect(() => {
    if (payment?.status === "Success") {
      navigate(`/payment/success/${payment._id}`, {
        replace: true,
        state: { payment },
      });
    }
  }, [payment, navigate]);

  const handleProceed = () => {
    navigate(`/payment/scan/${paymentId}/passcode`);
  };

  // Public entry point: scanning devices are usually NOT logged in. With no
  // login token and no active session, send them to the normal login page
  // (they can return here afterwards to continue the payment).
  if (!loginToken && !getToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (signingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Signing you in securely...
        </div>
      </div>
    );
  }

  if (signInError) {
    return (
      <PaymentStatusScreen
        variant="failed"
        title="Sign-in Link Expired"
        message={signInError}
        extra={
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                navigate("/login", { state: { from: location }, replace: true })
              }
              className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Continue to Login
            </button>
            <button
              onClick={() => navigate("/register-exam", { replace: true })}
              className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Go to Dashboard
            </button>
          </div>
        }
      />
    );
  }

  if (loading && !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Securing your payment details...
        </div>
      </div>
    );
  }

  if (error && !payment) {
    return (
      <PaymentStatusScreen
        variant="failed"
        title="Unable to Load Payment"
        message="We could not load your payment details. Please try again."
      />
    );
  }

  if (!payment) {
    return null;
  }

  const status = payment.status;

  if (status === "Expired") {
    return (
      <PaymentStatusScreen
        variant="expired"
        extra={
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-semibold text-slate-700">{payment.paymentNumber}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-400">Amount</span>
              <span className="font-bold text-slate-900">₹{payment.amount}</span>
            </div>
          </div>
        }
      />
    );
  }

  if (status === "Failed") {
    return (
      <PaymentStatusScreen
        variant="failed"
        extra={
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-semibold text-slate-700">{payment.paymentNumber}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-400">Amount</span>
              <span className="font-bold text-slate-900">₹{payment.amount}</span>
            </div>
          </div>
        }
      />
    );
  }

  // Payment received — within the 20-second grace / receipt generation.
  if (status === "PaymentReceived") {
    return (
      <PaymentStatusScreen
        variant="received"
        title="Payment Received"
        message="Your payment has been successfully received. Generating your receipt..."
        extra={
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-semibold text-slate-700">{payment.paymentNumber}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-400">Amount</span>
              <span className="font-bold text-slate-900">₹{payment.amount}</span>
            </div>
          </div>
        }
      />
    );
  }
  // Pending / PaymentInitiated → mobile UPI payment-selection screen.
  const isProcessing = status === "PaymentInitiated";

  return (
    <div className="min-h-screen bg-[#eef0ff] px-3 py-4 sm:flex sm:items-center sm:justify-center sm:p-6">
      <main className="mx-auto flex min-h-[720px] w-full max-w-[420px] flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_24px_65px_rgba(37,45,104,0.16)] sm:min-h-[760px]">
        <header className="flex items-center justify-between px-6 pb-4 pt-6">
          <button onClick={() => navigate(-1)} className="p-1 text-xl text-slate-400 transition hover:text-slate-700" aria-label="Close payment"><FaTimes /></button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><FaLock className="text-[10px] text-emerald-600" /> Secure UPI</div>
        </header>
        <section className="px-7 pt-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 text-xl font-black text-emerald-700">E</div>
          <p className="mt-4 text-base font-bold text-slate-800">Paying ExamPlat</p>
          <p className="mt-1 text-xs font-medium text-slate-400">Registration {payment.registrationId?.registrationNumber || payment.paymentNumber}</p>
          <p className="mt-5 text-5xl font-medium tracking-tight text-slate-900">₹{payment.amount}</p>
          {!isProcessing ? <p className="mt-4 text-xs font-semibold text-amber-600">Complete payment in {timeRemainingLabel}</p> : <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700"><span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /> Processing payment...</div>}
        </section>
        <section className="mt-auto border-t border-slate-100 px-6 pb-6 pt-5">
          <p className="mb-3 text-sm font-semibold text-slate-500">Select payment method</p>
          <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition hover:bg-slate-50"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1976b9] text-white"><FaUniversity /></div><div className="flex-1"><p className="text-sm font-bold text-slate-800">ExamPlat UPI Account</p><p className="mt-0.5 text-xs text-slate-400">UPI •••• 3397</p></div><FaChevronDown className="text-xs text-slate-400" /></button>
          {!isProcessing ? <button onClick={handleProceed} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#2334ef] py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">Pay ₹{payment.amount}<FaChevronRight className="text-xs" /></button> : <button onClick={refresh} className="mt-4 w-full rounded-full border border-indigo-200 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">Check payment status</button>}
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400"><FaInfoCircle /> Never share your UPI PIN to receive money</p>
        </section>
        <footer className="border-t border-slate-100 py-4 text-center text-xs font-semibold tracking-wide text-slate-400">UPI • EXAMPLAT SECURE PAYMENTS</footer>
      </main>
    </div>
  );
};

export default QRPayment;
