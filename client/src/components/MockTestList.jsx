import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalculator,
  FaCalendarAlt,
  FaCaretDown,
  FaCaretRight,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaFlask,
  FaPlay,
  FaRedoAlt,
  FaUsers,
} from "react-icons/fa";
import { getTestDisplayState, isTestAvailable } from "../utils/mockTestUtils";

const testVisuals = {
  JEE: {
    icon: <FaCalculator />,
    accent: "border-slate-200 bg-slate-100 text-slate-700",
    button: "bg-slate-800 hover:bg-slate-950",
    lightBg: "bg-slate-100",
    lightText: "text-slate-700",
    ring: "ring-slate-300",
  },
  NEET: {
    icon: <FaFlask />,
    accent: "border-slate-200 bg-slate-100 text-slate-700",
    button: "bg-slate-800 hover:bg-slate-950",
    lightBg: "bg-slate-100",
    lightText: "text-slate-700",
    ring: "ring-slate-300",
  },
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

const stateStyles = {
  Start: {
    badge: "border border-slate-200 bg-slate-50 text-slate-700",
    label: "Open",
  },
  ReTest: {
    badge: "border border-slate-200 bg-slate-50 text-slate-700",
    label: "Re-Test Available",
  },
  NotYetOpen: {
    badge: "border border-slate-200 bg-slate-50 text-slate-700",
    label: "Not Yet Open",
  },
  Completed: {
    badge: "border border-slate-200 bg-slate-100 text-slate-600",
    label: "Completed",
  },
  Unavailable: {
    badge: "border border-slate-200 bg-slate-100 text-slate-600",
    label: "Unavailable",
  },
};

function MockTestList({ examCategory, tests = [], loading = false }) {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const visual = testVisuals[examCategory] || {
    icon: <FaClipboardList />,
    accent: "border-slate-200 bg-slate-50 text-slate-700",
    button: "bg-slate-800 hover:bg-slate-950",
    lightBg: "bg-slate-50",
    lightText: "text-slate-700",
    ring: "ring-slate-200",
  };

  const availableTests = tests.filter((test) => isTestAvailable(test));
  const completedTests = tests.filter(
    (test) => getTestDisplayState(test) === "Completed"
  );

  const toggleExpand = (testId) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md shadow-slate-200/70">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
          <h2 className="text-xl font-bold text-slate-950">Loading {examCategory} mock tests</h2>
          <p className="mt-2 text-sm text-slate-500">
            Fetching tests mapped to your {examCategory} registration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
              {examCategory} Practice Portal
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">
              {examCategory} Mock Tests
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Each card shows a quick preview of the test. Click the triangle button on
              the right to view full details and start the attempt.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{tests.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Available
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{availableTests.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Completed
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {completedTests.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {tests.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md shadow-slate-200/70">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${visual.lightBg} ${visual.lightText}`}>
            {visual.icon}
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-950">
            No {examCategory} mock tests available
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No tests are mapped to your {examCategory} registration yet.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {tests.map((test) => {
            const state = getTestDisplayState(test);
            const stateStyle = stateStyles[state];
            const available = isTestAvailable(test);
            const isExpanded = expandedIds.has(test.testId);

            return (
              <article
                key={test.testId}
                className={`overflow-hidden rounded-2xl border bg-white shadow-md shadow-slate-200/70 transition hover:shadow-xl ${
                  isExpanded
                    ? `border-slate-300 ring-1 ${visual.ring}`
                    : "border-slate-200"
                }`}
              >
                {/* Horizontal preview row */}
                <div className="flex items-center gap-4 p-5 sm:gap-5 sm:p-6">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-2xl ${visual.accent}`}
                  >
                    {visual.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {examCategory} Mock Test
                    </p>
                    <h2 className="mt-1 truncate text-xl font-bold text-slate-950 sm:text-2xl">
                      {test.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="shrink-0 text-slate-400" />
                        <span>
                          Start:{" "}
                          <span className="font-semibold text-slate-700">
                            {formatDateTime(test.defaultStartAt)}
                          </span>
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FaClock className="shrink-0 text-slate-400" />
                        <span>
                          End:{" "}
                          <span className="font-semibold text-slate-700">
                            {formatDateTime(test.defaultEndAt)}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`hidden rounded-full px-3 py-1 text-xs font-bold md:inline-block ${stateStyle.badge}`}
                    >
                      {stateStyle.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpand(test.testId)}
                      aria-label={
                        isExpanded
                          ? "Collapse test details"
                          : "Expand test details"
                      }
                      aria-expanded={isExpanded}
                      title={isExpanded ? "Collapse details" : "View full details"}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                        isExpanded
                          ? `${visual.lightBg} ${visual.lightText}`
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                    </button>
                  </div>
                </div>

                {/* Expanded full details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6">
                    {/* Test ID */}
                    <p className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
                      Test ID:{" "}
                      <span className="font-bold text-slate-950">{test.testId}</span>
                    </p>

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Subject
                        </p>
                        <p className="mt-2 font-bold text-slate-950">
                          {test.subject || "-"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Attempts
                        </p>
                        <p className="mt-2 font-bold text-slate-950">
                          {test.attemptsUsed} / {test.maximumAttempts}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Candidates
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 font-bold text-slate-950">
                          <FaUsers className="text-sm text-slate-400" />
                          {test.candidateCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Remaining
                        </p>
                        <p className="mt-2 font-bold text-slate-950">
                          {test.remainingAttempts}
                        </p>
                      </div>
                    </div>

                    {/* Schedule + Tags */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="flex justify-between gap-4 rounded-xl bg-white px-4 py-3.5 ring-1 ring-slate-200">
                        <span className="font-semibold text-slate-600">Start At</span>
                        <span className="font-bold text-slate-950">
                          {formatDateTime(test.defaultStartAt)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 rounded-xl bg-white px-4 py-3.5 ring-1 ring-slate-200">
                        <span className="font-semibold text-slate-600">End At</span>
                        <span className="font-bold text-slate-950">
                          {formatDateTime(test.defaultEndAt)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold md:hidden ${stateStyle.badge}`}
                      >
                        {stateStyle.label}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {test.selectAllStudents ? "All mapped students" : "Restricted"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                        {test.status}
                      </span>
                    </div>

                    {/* Action Button */}
                    {available ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/mock-test/instructions/${test.testId}`)}
                        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white shadow-md shadow-slate-300 transition ${visual.button}`}
                      >
                        {state === "ReTest" ? (
                          <>
                            <FaRedoAlt className="text-sm" />
                            Take Re-Test
                          </>
                        ) : (
                          <>
                            <FaPlay className="text-sm" />
                            Start Test
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-300 px-5 py-3.5 font-semibold text-white"
                      >
                        {state === "NotYetOpen" ? (
                          <>
                            <FaClock className="mr-2 text-sm" />
                            Not Yet Open
                          </>
                        ) : state === "Completed" ? (
                          <>
                            <FaCheckCircle className="mr-2 text-sm" />
                            Exam Completed
                          </>
                        ) : (
                          "Unavailable"
                        )}
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default MockTestList;
