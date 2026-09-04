import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FaChevronRight, FaClock, FaCreditCard, FaLock, FaMobileAlt, FaQrcode, FaShieldAlt, FaUniversity } from "react-icons/fa";
import { createPayment } from "../services/paymentService";
import { getRegistrationById } from "../services/registrationService";
import { logActivity } from "../services/auditService";
import usePaymentSession from "../hooks/usePaymentSession";
import PaymentStatusScreen from "../components/PaymentStatusScreen";

const Payment = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [payment, setPayment] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const { session, payment: livePayment, timeRemainingLabel } = usePaymentSession(payment?._id, { pollIntervalMs: 5000 });

  useEffect(() => { if (session?.status === "Expired") toast.error("This payment session has expired."); }, [session?.status]);
  useEffect(() => {
    if (livePayment?.status === "Success") navigate(`/payment/success/${livePayment._id}`, { replace: true, state: { payment: livePayment } });
  }, [livePayment, navigate]);
  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await getRegistrationById(registrationId);
        setRegistration(response.registration);
      } catch (error) {
        toast.error(error.message || "Unable to load registration.");
        navigate("/register-exam");
        setPageLoading(false);
        return;
      }
      try {
        const response = await createPayment({ registrationId, paymentMethod: "UPI" });
        setPayment(response.payment);
      } catch (error) {
        toast.error(error.message || "Unable to start UPI payment.");
      } finally { setPageLoading(false); }
    };
    if (registrationId) { fetchRegistration(); logActivity("Viewed Payments"); } else navigate("/register-exam");
  }, [registrationId, navigate]);

  const qrPaymentUrl = payment ? `${window.location.origin}/payment/scan/${payment._id}` : null;
  const isExpired = session?.status === "Expired" || livePayment?.status === "Expired";
  const chooseMethod = (method) => {
    if (method === "upi") return setSelectedMethod("upi");
    if (payment) navigate(method === "card" ? "/payment/card" : "/payment/netbanking", { state: { payment } });
  };

  if (pageLoading) return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]"><span className="h-7 w-7 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" /></div>;
  if (!registration) return null;
  if (isExpired) return <PaymentStatusScreen variant="expired" extra={<button onClick={() => navigate(0)} className="w-full rounded-xl bg-[#1355e8] px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Start a new payment session</button>} />;

  const methods = [
    { id: "upi", title: "UPI", subtitle: "Google Pay, PhonePe & more", icon: FaMobileAlt },
    { id: "card", title: "Cards", subtitle: "Credit, debit & ATM cards", icon: FaCreditCard },
    { id: "netbanking", title: "Netbanking", subtitle: "Pay using your bank account", icon: FaUniversity },
  ];

  return <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 sm:py-10">
    <main className="mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)] ring-1 ring-slate-200/70">
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1355e8] text-lg font-black text-white shadow-lg shadow-blue-200">E</div><div><p className="font-bold tracking-tight text-slate-900">ExamPlat</p><p className="text-xs font-medium text-slate-500">Secure payments</p></div></div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700"><FaLock className="text-[10px]" /> 100% Secure</div>
      </header>
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <section className="border-b border-slate-100 px-6 py-7 sm:px-8 lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold text-slate-500">Payment for</p><h1 className="mt-1 text-xl font-bold text-slate-900">{registration.examType} Examination</h1><p className="mt-1 text-sm text-slate-500">Registration no. {registration.registrationNumber}</p>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Amount payable</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">₹{registration.registrationFee}</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">Exam fee</span></div>
          {payment && session?.status === "Pending" && <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 ring-1 ring-amber-100"><FaClock /> Complete payment in {timeRemainingLabel}</div>}
          <h2 className="mt-8 text-base font-bold text-slate-900">Choose a payment method</h2>
          <div className="mt-3 space-y-2">{methods.map(({ id, title, subtitle, icon: Icon }) => <button key={id} type="button" onClick={() => chooseMethod(id)} className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition ${selectedMethod === id ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600" : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"}`}><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedMethod === id ? "bg-[#1355e8] text-white" : "bg-slate-100 text-slate-600"}`}><Icon /></div><div className="min-w-0 flex-1"><p className="font-bold text-slate-800">{title}</p><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div><FaChevronRight className="text-xs text-slate-400" /></button>)}</div>
        </section>
        <section className="bg-slate-50/60 px-6 py-7 sm:px-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><FaMobileAlt /></div><div><h2 className="font-bold text-slate-900">Pay via UPI</h2><p className="text-xs text-slate-500">Scan QR or enter your UPI ID</p></div></div>
          <div className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200"><label className="text-xs font-bold uppercase tracking-wide text-slate-500">UPI ID</label><div className="mt-2 flex gap-2"><input type="text" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100" /><button type="button" className="rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700">Send</button></div></div>
          {payment && qrPaymentUrl ? <div className="mt-5 rounded-2xl bg-white p-5 text-center ring-1 ring-slate-200"><p className="text-sm font-bold text-slate-800">Scan with any UPI app</p><Link to={`/payment/scan/${payment._id}`} className="mx-auto mt-4 block w-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:shadow-md"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPaymentUrl)}`} alt="UPI QR Code" className="h-44 w-44 rounded-lg" /></Link><div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><FaQrcode /> Click the QR to continue in this demo</div></div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">QR code is unavailable for this registration.</div>}
        </section>
      </div>
      <footer className="flex items-center justify-center gap-2 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500"><FaShieldAlt className="text-blue-600" /> Payments are secured with bank-grade encryption</footer>
    </main>
  </div>;
};

export default Payment;
