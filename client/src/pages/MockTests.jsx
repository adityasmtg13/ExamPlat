import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaCalculator, FaFlask } from "react-icons/fa";
import { getMockTests } from "../services/mockTestService";

const examDetails = {
  "JEE Main": {
    title: "JEE Main Mock Test",
    body: "National Testing Agency",
    duration: "3 Hours",
    questions: "90",
    marks: "300",
    sections: ["Physics", "Chemistry", "Mathematics"],
    icon: <FaCalculator />,
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    button: "bg-blue-700 hover:bg-blue-800",
  },

  NEET: {
    title: "NEET Mock Test",
    body: "National Testing Agency",
    duration: "3 Hours 20 Minutes",
    questions: "180",
    marks: "720",
    sections: ["Physics", "Chemistry", "Botany", "Zoology"],
    icon: <FaFlask />,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

function MockTests() {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockTests();
  }, []);

  const loadMockTests = async () => {
    try {
      const data = await getMockTests();
      setMockTests(data.mockTests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
            <div className="text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700" />
              <h2 className="text-xl font-bold text-slate-950">Loading mock tests</h2>
              <p className="mt-2 text-sm text-slate-500">
                Fetching your registered exam attempts.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                Practice using official examination patterns before your real exam.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Exams
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{mockTests.length}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Available
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {mockTests.filter((test) => test.canAttempt).length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {mockTests.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md shadow-slate-200/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-700">
              <FaClipboardList />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-950">No Registered Exams</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Register for an examination to unlock official mock tests and attempt tracking.
            </p>
            <button
              type="button"
              onClick={() => navigate("/register-exam")}
              className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-cyan-700"
            >
              Register Examination
            </button>
          </section>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            {mockTests.map((test) => {
              const details = examDetails[test.examType];

              return (
                <article
                  key={test.registrationId}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b border-slate-100 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-xl border text-2xl ${details.accent}`}
                        >
                          {details.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {details.body}
                          </p>
                          <h2 className="mt-2 text-2xl font-bold text-slate-950">
                            {details.title}
                          </h2>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          test.registrationStatus === "Registered"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {test.registrationStatus}
                      </span>
                    </div>

                    <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                      Registration No:{" "}
                      <span className="font-bold text-slate-950">
                        {test.registrationNumber}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Duration
                        </p>
                        <p className="mt-2 font-bold text-slate-950">{details.duration}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Questions
                        </p>
                        <p className="mt-2 font-bold text-slate-950">{details.questions}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Marks
                        </p>
                        <p className="mt-2 font-bold text-slate-950">{details.marks}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-sm font-bold text-slate-900">Sections</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {details.sections.map((section) => (
                          <span
                            key={section}
                            className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-4">
                        <span className="font-semibold text-slate-600">Attempts Used</span>
                        <span className="font-bold text-slate-950">
                          {test.attemptsUsed} / {test.maximumAttempts}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-4">
                        <span className="font-semibold text-slate-600">Remaining</span>
                        <span className="font-bold text-slate-950">
                          {test.remainingAttempts}
                        </span>
                      </div>
                    </div>

                    {test.canAttempt ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/mock-test/instructions/${test.registrationId}`)
                        }
                        className={`w-full rounded-xl px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-200 transition ${details.button}`}
                      >
                        Take Mock Test
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-slate-300 px-5 py-3.5 font-semibold text-white"
                      >
                        {test.registrationStatus === "Pending Payment"
                          ? "Complete Registration Payment"
                          : "Maximum Attempts Reached"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default MockTests;
