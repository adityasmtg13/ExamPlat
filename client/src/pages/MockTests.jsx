import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalculator,
  FaClipboardList,
  FaFlask,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMockTests } from "../services/mockTestService";

const testVisuals = {
  JEE: {
    icon: <FaCalculator />,
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    button: "bg-blue-700 hover:bg-blue-800",
  },
  NEET: {
    icon: <FaFlask />,
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

function MockTests() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const loadMockTests = async () => {
    try {
      const data = await getMockTests();
      setTests(data.mockTests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMockTests();
  }, []);

  const selectedTest = useMemo(
    () => tests.find((test) => test.testId === selectedTestId) || tests[0] || null,
    [tests, selectedTestId]
  );

  const availableTests = tests.filter((test) => test.canAttempt);

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
                Fetching tests mapped to your registered exam category.
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
                Select a mapped test, review the details, and start the attempt when it is open.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Tests
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {tests.length}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Available
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {availableTests.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {tests.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md shadow-slate-200/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-700">
              <FaClipboardList />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-950">No mock tests available</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              No tests are mapped to your registered exam category yet.
            </p>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              {tests.map((test) => {
                const visual = testVisuals[test.examCategory] || {
                  icon: <FaClipboardList />,
                  accent: "border-slate-200 bg-slate-50 text-slate-700",
                  button: "bg-slate-950 hover:bg-cyan-700",
                };

                const isSelected = selectedTest?.testId === test.testId;

                return (
                  <article
                    key={test.testId}
                    onClick={() => setSelectedTestId(test.testId)}
                    className={`cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-md shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-xl ${
                      isSelected ? "border-cyan-300 ring-2 ring-cyan-100" : "border-slate-200"
                    }`}
                  >
                    <div className="border-b border-slate-100 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-xl border text-2xl ${visual.accent}`}
                          >
                            {visual.icon}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              {test.examCategory} Mock Test
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-950">
                              {test.title}
                            </h2>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              test.canAttempt
                                ? "bg-emerald-50 text-emerald-700"
                                : test.status === "Scheduled"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {test.canAttempt ? "Ready" : test.status}
                          </span>

                          {isSelected ? (
                            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                              Selected
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                        Test ID: <span className="font-bold text-slate-950">{test.testId}</span>
                      </p>
                    </div>

                    <div className="space-y-5 p-6">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Subject
                          </p>
                          <p className="mt-2 font-bold text-slate-950">{test.subject || "-"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Start
                          </p>
                          <p className="mt-2 font-bold text-slate-950">
                            {formatDateTime(test.defaultStartAt)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            End
                          </p>
                          <p className="mt-2 font-bold text-slate-950">
                            {formatDateTime(test.defaultEndAt)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Attempts
                          </p>
                          <p className="mt-2 font-bold text-slate-950">
                            {test.attemptsUsed} / {test.maximumAttempts}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-4">
                          <span className="font-semibold text-slate-600">Candidates</span>
                          <span className="font-bold text-slate-950">{test.candidateCount}</span>
                        </div>
                        <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-4">
                          <span className="font-semibold text-slate-600">Remaining</span>
                          <span className="font-bold text-slate-950">{test.remainingAttempts}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                          {test.selectAllStudents ? "All mapped students" : "Restricted"}
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">
                          {test.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedTestId(test.testId);
                        }}
                        className={`w-full rounded-xl px-5 py-3.5 font-semibold text-white shadow-lg shadow-slate-200 transition ${visual.button}`}
                      >
                        Select Test
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            {selectedTest ? (
              <section className="mt-8 rounded-2xl border border-cyan-200 bg-white p-6 shadow-lg shadow-cyan-100/60 sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                      Selected Test
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      {selectedTest.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {selectedTest.testId} · {selectedTest.examCategory}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {selectedTest.canAttempt
                      ? "Review the instructions and start the selected test when ready."
                      : selectedTest.status === "Scheduled"
                        ? "This test is scheduled and will open at the configured start time."
                        : "This test is not open for attempts right now."}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Start Time
                    </p>
                    <p className="mt-2 font-bold text-slate-950">
                      {formatDateTime(selectedTest.defaultStartAt)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      End Time
                    </p>
                    <p className="mt-2 font-bold text-slate-950">
                      {formatDateTime(selectedTest.defaultEndAt)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Attempts Remaining
                    </p>
                    <p className="mt-2 font-bold text-slate-950">
                      {selectedTest.remainingAttempts}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {selectedTest.canAttempt ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/mock-test/instructions/${selectedTest.testId}`)
                      }
                      className={`rounded-xl px-6 py-3 font-semibold text-white shadow-lg shadow-slate-200 transition ${
                        testVisuals[selectedTest.examCategory]?.button || "bg-slate-950 hover:bg-cyan-700"
                      }`}
                    >
                      Start Test
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-xl bg-slate-300 px-6 py-3 font-semibold text-white"
                    >
                      {selectedTest.status === "Scheduled" ? "Not Yet Open" : "Unavailable"}
                    </button>
                  )}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MockTests;