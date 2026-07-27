import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFileContract,
  FaHeadset,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const footerCards = [
  {
    icon: <FaShieldAlt />,
    title: "Secure student services",
    description: "Your student information is protected with responsible data practices.",
  },
  {
    icon: <FaHeadset />,
    title: "Need assistance?",
    description: "Get help with your account, exams, and platform services.",
    action: "Contact support",
    href: "mailto:support@nationalexamplatform.in",
  },
  {
    icon: <FaFileContract />,
    title: "Clear policies",
    description: "Review how the platform works and the terms that apply to its use.",
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {footerCards.map((card) => (
            <section
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-lg text-cyan-800">
                {card.icon}
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-950">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              {card.action && (
                <a
                  href={card.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                >
                  <FaEnvelope className="text-xs" />
                  {card.action}
                </a>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-slate-200 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="National Exam Platform"
              className="h-10 w-10 rounded-lg border border-slate-200 bg-white p-1.5"
            />
            <div>
              <p className="font-bold text-slate-950">National Exam Platform</p>
              <p className="text-sm text-slate-500">Exam preparation, made more accessible.</p>
            </div>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold">
            <Link to="/privacy-policy" className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-700">
              <FaLock className="text-xs" />
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="text-slate-600 hover:text-cyan-700">
              Terms &amp; Conditions
            </Link>
            <a href="mailto:support@nationalexamplatform.in" className="text-slate-600 hover:text-cyan-700">
              Contact Us
            </a>
          </nav>
        </div>

        <p className="mt-7 text-xs leading-5 text-slate-500">
          © {year} National Exam Platform. All rights reserved. This platform provides educational and exam-preparation services.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
