import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaArrowLeft, FaChevronRight, FaLock, FaShieldAlt, FaUniversity } from "react-icons/fa";

const banks = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"];

const NetBankingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payment = location.state?.payment;
  const [selectedBank, setSelectedBank] = useState("");

  if (!payment) {
    navigate("/register-exam");
    return null;
  }

  const continueToBank = () => {
    if (!selectedBank) return toast.error("Please select your bank.");
    toast.info("Netbanking is currently a front-end checkout preview.");
  };

  return <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 sm:py-10">
    <main className="mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)] ring-1 ring-slate-200/70">
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Go back"><FaArrowLeft /></button><div className="text-center"><p className="text-sm font-bold text-slate-900">ExamPlat</p><p className="text-[11px] font-medium text-slate-500">Secure checkout</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><FaLock className="text-xs" /></div></header>
      <section className="px-6 py-7 sm:px-8">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1355e8] text-white"><FaUniversity /></div><div><h1 className="font-bold text-slate-900">Netbanking</h1><p className="text-xs text-slate-500">Select your bank to continue</p></div></div>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Amount payable</p><p className="mt-1 text-2xl font-bold text-slate-900">₹{payment.amount}</p></div><p className="text-xs font-medium text-slate-500">{payment.paymentNumber}</p></div>
        <h2 className="mt-7 text-sm font-bold text-slate-800">Popular banks</h2>
        <div className="mt-3 space-y-2">{banks.map((bank) => <button key={bank} onClick={() => setSelectedBank(bank)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left text-sm font-semibold transition ${selectedBank === bank ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}><span className={`h-3 w-3 rounded-full border-2 ${selectedBank === bank ? "border-blue-600 bg-blue-600 ring-2 ring-blue-100" : "border-slate-300"}`} />{bank}<FaChevronRight className="ml-auto text-xs text-slate-400" /></button>)}</div>
        <button onClick={continueToBank} className="mt-7 w-full rounded-xl bg-[#1355e8] py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Continue to bank</button>
        <p className="mt-4 text-center text-xs leading-5 text-slate-500">This Netbanking screen is a frontend preview. No banking details are collected.</p>
      </section>
      <footer className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs text-slate-500"><FaShieldAlt className="text-blue-600" /> Secured with bank-grade encryption</footer>
    </main>
  </div>;
};

export default NetBankingPayment;
