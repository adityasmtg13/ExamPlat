import { Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function LegalPageLayout({ eyebrow, title, intro, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-cyan-700"
        >
          <FaArrowLeft className="text-xs" />
          Back to dashboard
        </Link>

        <article className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
          <header className="bg-slate-950 px-6 py-9 text-white sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{intro}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400">
              <FaCalendarAlt /> Last updated: July 27, 2026
            </p>
          </header>
          <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export default LegalPageLayout;
