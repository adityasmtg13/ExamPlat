import { FaCheckCircle, FaClock, FaExclamationCircle, FaLock, FaShieldAlt } from "react-icons/fa";

/**
 * PaymentStatusScreen
 *
 * Shared full-page status card used by the QR payment pages. The backend is
 * the source of truth for which variant is shown; this component only renders
 * the copy and any actions provided by the parent.
 *
 * Variants:
 *  - "pending"        Payment session is live (shows remaining time)
 *  - "processing"     Payment attempt in progress (PaymentInitiated)
 *  - "received"       Payment received; receipt being generated (grace)
 *  - "expired"        5-minute session expired, no payment received
 *  - "failed"         Payment could not be confirmed (refund messaging)
 */
const PaymentStatusScreen = ({
  variant = "pending",
  title,
  message,
  extra,
  children,
  countdownLabel,
  footerLabel = "Your payment details are securely protected",
}) => {
  const isSuccess = variant === "received";
  const isError = variant === "expired" || variant === "failed";
  const isProcessing = variant === "processing";

  const defaultTitle = {
    pending: "Payment Pending",
    processing: "Payment Pending",
    received: "Payment Received",
    expired: "Payment Expired",
    failed: "Payment Failed",
  }[variant];

  const defaultMessage = {
    pending: "Please complete your payment before the timer expires.",
    processing: "Your payment is being processed. Please wait.",
    received:
      "Your payment has been successfully received. Generating your receipt...",
    expired:
      "This payment session has expired because the payment was not confirmed within 5 minutes.",
    failed:
      "We could not confirm your payment. If the amount has been deducted from your bank account, the amount will be credited/refunded within 3 working days. Please do not make another payment using this transaction.",
  }[variant];

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 sm:py-10">
      <main className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
        <header className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg shadow-blue-200">
                E
              </div>
              <div>
                <p className="text-base font-bold tracking-tight text-slate-900">ExamPlat</p>
                <p className="text-xs font-medium text-slate-500">Secure UPI payment</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <FaLock className="text-[10px]" /> Secure
            </div>
          </div>
        </header>

        <section className="px-6 pb-7 pt-10 sm:px-8">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-emerald-100 text-emerald-600"
                : isError
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {isProcessing ? (
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            ) : isSuccess ? (
              <FaCheckCircle className="text-4xl" />
            ) : isError ? (
              <FaExclamationCircle className="text-4xl" />
            ) : (
              <FaClock className="text-4xl" />
            )}
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
            {title || defaultTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-slate-500">
            {message || defaultMessage}
          </p>

          {countdownLabel && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 px-5 py-4 ring-1 ring-amber-100">
              <FaClock className="text-amber-600" />
              <p className="text-sm font-bold text-amber-700">
                Time remaining: {countdownLabel}
              </p>
            </div>
          )}

          {extra}
          {children && <div className="mt-7">{children}</div>}
        </section>

        <footer className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 text-center text-xs text-slate-500">
          <FaShieldAlt className="text-blue-600" /> {footerLabel}
        </footer>
      </main>
    </div>
  );
};

export default PaymentStatusScreen;