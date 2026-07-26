import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function ComingSoon({ title, description }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#103f7c]">Feature in progress</p>
          <h1 className="mt-4 text-3xl font-bold text-[#103f7c]">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-xl bg-[#103f7c] px-6 py-3 font-semibold text-white transition hover:bg-[#0b2d57]"
            >
              Return to Dashboard
            </Link>
            <Link
              to="/"
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
