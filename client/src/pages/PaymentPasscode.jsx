import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FaBackspace, FaInfoCircle, FaLock, FaTimes } from "react-icons/fa";

import usePaymentSession from "../hooks/usePaymentSession";
import PaymentStatusScreen from "../components/PaymentStatusScreen";
import { initiatePayment } from "../services/paymentService";

/**
 * Passcode step of the QR payment flow.
 *
 * The user enters any 6-digit numerical passcode (no real authentication).
 *
 * Clicking "Pay" only INITIATES the payment attempt (PaymentInitiated). The
 * payment is NOT considered received: the backend (mock) middleman separately
 * confirms receipt, and only then does the payment move to PaymentReceived →
 * (20-second grace) → Success. This page merely displays the backend-driven
 * state and never fabricates success on a button click.
 */
const PaymentPasscode = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams();

  const {
    payment,
    loading,
    error,
    refresh,
    timeRemainingLabel,
  } = usePaymentSession(paymentId);

  const [passcode, setPasscode] = useState("");
  const [initiating, setInitiating] = useState(false);
  const [payLocked, setPayLocked] = useState(false);

  // Continue into the existing success flow once the backend confirms and
  // finalizes the payment (after the receipt grace period).
  useEffect(() => {
    if (payment?.status === "Success") {
      navigate(`/payment/success/${payment._id}`, {
        replace: true,
        state: { payment },
      });
    }
  }, [payment, navigate]);

  const handlePay = async () => {
    if (initiating || payLocked) return;

    if (passcode.length !== 6) {
      toast.error("Please enter a 6-digit passcode.");
      return;
    }

    try {
      setInitiating(true);
      setPayLocked(true);

      // This only records "user clicked Pay". Settlement is decided by the
      // backend middleman-confirmation path, not by the frontend.
      const response = await initiatePayment(paymentId);

      if (!response.success) {
        toast.error(response.message || "Payment could not be initiated.");
        refresh();
        return;
      }
    } catch (initError) {
      toast.error(initError.message || "Payment could not be initiated.");
      refresh();
    } finally {
      setInitiating(false);
      window.setTimeout(() => setPayLocked(false), 3000);
    }
  };

  const enterDigit = (digit) => {
    setPasscode((current) => `${current}${digit}`.slice(0, 6));
  };

  const removeDigit = () => {
    setPasscode((current) => current.slice(0, -1));
  };

  if (loading && !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Preparing secure payment...
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
    return <PaymentStatusScreen variant="expired" />;
  }

  if (status === "Failed") {
    return <PaymentStatusScreen variant="failed" />;
  }

  // Payment received → show the received/grace screen (never claim success
  // ourselves; navigation happens automatically on Success).
  if (status === "PaymentReceived") {
    return (
      <PaymentStatusScreen
        variant="received"
        title="Payment Received"
        message="Your payment has been successfully received. Generating your receipt..."
      />
    );
  }

  // Attempt is processing → show the processing state.
  if (status === "PaymentInitiated") {
    return (
      <PaymentStatusScreen
        variant="processing"
        title="Processing Payment"
        message="Your payment is being processed. Please do not close this page."
        extra={
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-5 py-4 ring-1 ring-blue-100">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm font-bold text-blue-700">Waiting for payment confirmation...</p>
          </div>
        }
      />
    );
  }

  // Pending → passcode entry UI.
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return <div className="min-h-screen bg-[#eef0ff] px-3 py-4 sm:flex sm:items-center sm:justify-center sm:p-6">
    <main className="mx-auto flex min-h-[720px] w-full max-w-[420px] flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_24px_65px_rgba(37,45,104,0.16)] sm:min-h-[760px]">
      <header className="flex items-center justify-between px-6 pb-3 pt-6"><div className="text-lg font-black italic tracking-tight text-[#2c2f8b]">UPI<span className="ml-0.5 text-orange-500">›</span></div><button onClick={() => navigate(`/payment/scan/${paymentId}`)} className="p-1 text-xl text-slate-400 transition hover:text-slate-700" aria-label="Close PIN screen"><FaTimes /></button></header>
      <section className="px-6"><p className="text-sm font-semibold text-slate-500">ExamPlat UPI Account •••• 3397</p><div className="mt-3 flex items-center justify-between rounded-xl bg-[#fff2cb] px-4 py-3.5"><div><p className="text-lg font-bold text-slate-800">Pay ₹{payment.amount}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">To ExamPlat</p></div><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2430b7] text-white"><FaLock className="text-sm" /></div></div></section>
      <section className="px-6 pt-24 text-center"><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Enter 6-digit UPI PIN</p><div className="mx-auto mt-6 flex max-w-[260px] justify-between" aria-label="6-digit UPI PIN">{Array.from({ length: 6 }, (_, index) => <span key={index} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${passcode[index] ? "border-[#2430d8] bg-[#2430d8]" : "border-slate-300"}`}><span className={passcode[index] ? "h-2 w-2 rounded-full bg-white" : ""} /></span>)}</div><p className="mt-4 text-xs font-semibold text-amber-600">Time remaining: {timeRemainingLabel}</p></section>
      <div className="mt-auto px-6 pb-5"><p className="mb-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><FaInfoCircle /> Never enter your UPI PIN to receive money</p><div className="grid grid-cols-3 gap-x-5 gap-y-3">{keys.map((key) => <button key={key} type="button" onClick={() => enterDigit(key)} className="h-14 rounded-full bg-slate-100 text-xl font-medium text-slate-700 transition hover:bg-slate-200 active:bg-slate-300">{key}</button>)}<button type="button" onClick={removeDigit} className="flex h-14 items-center justify-center rounded-full bg-[#e9eafe] text-xl text-[#2835c7] transition hover:bg-indigo-100" aria-label="Remove last digit"><FaBackspace /></button><button type="button" onClick={() => enterDigit("0")} className="h-14 rounded-full bg-slate-100 text-xl font-medium text-slate-700 transition hover:bg-slate-200 active:bg-slate-300">0</button><button type="button" onClick={handlePay} disabled={passcode.length !== 6 || initiating || payLocked} className={`h-14 rounded-full text-sm font-bold text-white transition ${passcode.length === 6 && !initiating && !payLocked ? "bg-[#2430e8] shadow-lg shadow-indigo-200 hover:bg-indigo-700" : "cursor-not-allowed bg-indigo-200"}`}>{initiating || payLocked ? "PROCESSING" : "PAY"}</button></div></div>
      <footer className="border-t border-slate-100 py-4 text-center text-xs font-semibold tracking-wide text-slate-400">UPI • EXAMPLAT SECURE PAYMENTS</footer>
    </main>
  </div>;
};

export default PaymentPasscode;
