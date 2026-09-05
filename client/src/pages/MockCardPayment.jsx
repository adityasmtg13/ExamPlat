import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FaArrowLeft, FaCreditCard, FaLock, FaShieldAlt } from "react-icons/fa";
import { completePayment, getPaymentById } from "../services/paymentService";

const MockCardPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [pageLoading, setPageLoading] = useState(!location.state?.payment);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (payment) return;
    const paymentId = searchParams.get("paymentId");
    if (!paymentId) { navigate("/register-exam", { replace: true }); return; }
    getPaymentById(paymentId).then((response) => setPayment(response.payment)).catch((error) => {
      toast.error(error.message || "Unable to load payment details.");
      navigate("/register-exam", { replace: true });
    }).finally(() => setPageLoading(false));
  }, [payment, searchParams, navigate]);
  if (pageLoading) return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]"><span className="h-7 w-7 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" /></div>;
  if (!payment) return null;
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cardHolder.trim() || !expiry.trim() || !cvv.trim()) return toast.error("Please fill in all card details.");
    try { setLoading(true); await new Promise((resolve) => setTimeout(resolve, 3000)); const response = await completePayment(payment._id); navigate("/payment/success", { state: { payment: response.payment } }); }
    catch { navigate(`/payment/success/${payment._id}`, { state: { payment: { ...payment, status: "Failed" }, failure: true } }); } finally { setLoading(false); }
  };
  const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100";
  return <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 sm:py-10"><main className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)] ring-1 ring-slate-200/70">
    <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Go back"><FaArrowLeft /></button><div className="text-center"><p className="text-sm font-bold text-slate-900">ExamPlat</p><p className="text-[11px] font-medium text-slate-500">Secure checkout</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><FaLock className="text-xs" /></div></header>
    <section className="px-6 py-7 sm:px-8"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1355e8] text-white"><FaCreditCard /></div><div><h1 className="font-bold text-slate-900">Card payment</h1><p className="text-xs text-slate-500">Credit, debit & ATM cards</p></div></div><div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Amount payable</p><p className="mt-1 text-2xl font-bold text-slate-900">₹{payment.amount}</p></div><p className="text-xs font-medium text-slate-500">{payment.paymentNumber}</p></div>
      <form onSubmit={handlePayment} className="mt-7 space-y-5"><label className="block text-sm font-bold text-slate-700">Card number<input type="text" maxLength={19} placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className={fieldClass} /></label><label className="block text-sm font-bold text-slate-700">Name on card<input type="text" placeholder="John Doe" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className={fieldClass} /></label><div className="grid grid-cols-2 gap-4"><label className="block text-sm font-bold text-slate-700">Expiry<input type="text" placeholder="MM/YY" maxLength={5} value={expiry} onChange={(e) => setExpiry(e.target.value)} className={fieldClass} /></label><label className="block text-sm font-bold text-slate-700">CVV<input type="password" maxLength={3} placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} className={fieldClass} /></label></div><button type="submit" disabled={loading} className={`w-full rounded-xl py-4 text-base font-bold text-white shadow-lg transition ${loading ? "cursor-not-allowed bg-slate-400 shadow-none" : "bg-[#1355e8] shadow-blue-200 hover:bg-blue-700"}`}>{loading ? "Processing payment..." : `Pay ₹${payment.amount}`}</button></form><p className="mt-4 text-center text-xs text-slate-500">Demo checkout — do not enter real card details.</p>
    </section><footer className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs text-slate-500"><FaShieldAlt className="text-blue-600" /> 256-bit encrypted checkout</footer>
  </main></div>;
};
export default MockCardPayment;
