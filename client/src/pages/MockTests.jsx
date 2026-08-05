import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalculator,
  FaFlask,
  FaPlay,
  FaCheckCircle,
  FaCalendarAlt,
  FaLock,
  FaCreditCard,
} from "react-icons/fa";
import { toast } from "sonner";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMockTests } from "../services/mockTestService";
import { getRegistrationHistory } from "../services/registrationService";
import { logActivity } from "../services/auditService";
import { getTestDisplayState, isTestAvailable } from "../utils/mockTestUtils";

const examConfigs = {
  JEE: {
    label: "JEE Main",
    icon: <FaCalculator />,
    gradient: "from-blue-600 to-blue-800",
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    button: "bg-blue-700 hover:bg-blue-800",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    ring: "ring-blue-200",
    route: "/mock-tests/jee",
  },
  NEET: {
    label: "NEET",
    icon: <FaFlask />,
    gradient: "from-emerald-500 to-emerald-700",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
    ring: "ring-emerald-200",
    route: "/mock-tests/neet",
  },
};

function MockTests() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [historyRes, testsRes] = await Promise.all([
        getRegistrationHistory(),
        getMockTests(),
      ]);

      const history = historyRes.registrations || historyRes || [];
      setRegistrations(history);

      setTests(testsRes.mockTests || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load mock test data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    logActivity("Viewed Mock Tests");
  }, []);

  // Determine which exams the user has paid for (status "Registered")
  const registeredExams = registrations
    .filter((reg) => reg.status === "Registered")
    .map((reg) => (reg.examType === "JEE Main" ? "JEE" : reg.examType));

  const hasAnyRegistration = registrations.length > 0;
  const hasPaidRegistration = registeredExams.length > 0;

  // Build exam cards for JEE and NEET
  const examCards = ["JEE", "NEET"].map((exam) => {
    const config = examConfigs[exam];
    const examTests = tests.filter((test) => test.examCategory === exam);

    const activeTests = examTests.filter((test) => isTestAvailable(test));
    const completedTests = examTests.filter(
      (test) => getTestDisplayState(test) === "Completed"
    );
    const upcomingTests = examTests.filter(
      (test) => getTestDisplayState(test) === "NotYetOpen"
    );

    const isRegistered = registeredExams.includes(exam);

    return {
      exam,
      config,
      isRegistered,
      totalTests: examTests.length,
      activeCount: activeTests.length,
      completedCount: completedTests.length,
      upcomingCount: upcomingTests.length,
    };
  });

  const handleStart = (exam) => {
    const card = examCards.find((c) => c.exam === exam);

    if (!card) {
      return;
    }

    if (!card.isRegistered) {
      toast.error(`You need to register and pay for ${card.config.label} first.`);
      navigate("/register-exam");
      return;
    }

    navigate(card.config.route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
            <div className="text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700" />
              <h2 className="text-xl font-bold text-slate-950">Loading mock test portal</h2>
              <p className="mt-2 text-sm text-slate-500">
                Fetching your exam registrations and available tests.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Practice Portal
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
                Mock Tests
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Select your exam to view and start available mock tests. You can access
                mock tests for exams you have registered and paid for.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Registered Exams
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {registeredExams.length}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Total Tests
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{tests.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* No registrations at all */}
        {!hasAnyRegistration ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md shadow-slate-200/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-700">
              <FaCreditCard />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-950">
              No Exam Registrations Found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              You haven't registered for any exams yet. Register and pay the fee to
              unlock mock tests for JEE Main and NEET.
            </p>
            <button
              type="button"
              onClick={() => navigate("/register-exam")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-800"
            >
              <FaCreditCard className="text-sm" />
              Register & Pay Fees
            </button>
          </section>
        ) : (
          <>
            {/* Pending payment banner */}
            {!hasPaidRegistration && (
              <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-md shadow-amber-100/60">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <FaLock className="mt-1 shrink-0 text-amber-600" />
                    <div>
                      <h2 className="text-lg font-bold text-amber-900">
                        Complete Your Payment
                      </h2>
                      <p className="mt-1 text-sm text-amber-700">
                        You have pending registrations. Complete the payment to unlock
                        mock tests for your exams.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/register-exam")}
                    className="shrink-0 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-amber-700"
                  >
                    Complete Payment
                  </button>
                </div>
              </section>
            )}

            {/* Exam Cards */}
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              {examCards.map((card) => {
                const { config } = card;

                return (
                  <article
                    key={card.exam}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-md shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl ${
                      card.isRegistered
                        ? "border-slate-200"
                        : "border-slate-200 opacity-90"
                    }`}
                  >
                    {/* Card Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 text-2xl backdrop-blur">
                            {config.icon}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                              {card.exam} Exam
                            </p>
                            <h2 className="mt-1 text-2xl font-bold">
                              {config.label}
                            </h2>
                          </div>
                        </div>

                        {card.isRegistered ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                            <FaCheckCircle className="text-sm" />
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                            <FaLock className="text-sm" />
                            Locked
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-5 p-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Total
                          </p>
                          <p className="mt-2 text-2xl font-bold text-slate-950">
                            {card.totalTests}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Active
                          </p>
                          <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {card.activeCount}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Completed
                          </p>
                          <p className="mt-2 text-2xl font-bold text-blue-600">
                            {card.completedCount}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Upcoming
                          </p>
                          <p className="mt-2 text-2xl font-bold text-amber-600">
                            {card.upcomingCount}
                          </p>
                        </div>
                      </div>

                      {/* Status Details */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">
                          <FaPlay className="shrink-0 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-700">
                            {card.activeCount} Available Now
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                          <FaCheckCircle className="shrink-0 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">
                            {card.completedCount} Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5">
                          <FaCalendarAlt className="shrink-0 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">
                            {card.upcomingCount} Upcoming
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {card.isRegistered ? (
                        <button
                          type="button"
                          onClick={() => handleStart(card.exam)}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-200 transition ${config.button}`}
                        >
                          <FaPlay className="text-sm" />
                          Start {config.label} Mock Tests
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => navigate("/register-exam")}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-3.5 font-semibold text-slate-600 transition hover:border-cyan-600 hover:text-cyan-700"
                        >
                          <FaCreditCard className="text-sm" />
                          Pay Fees to Unlock
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MockTests;