import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFinalResults } from "../services/finalResultService";
import { logActivity } from "../services/auditService";

const formatTime = (seconds) => {
  if (seconds == null || Number.isNaN(Number(seconds))) return "—";
  if (Number(seconds) < 60) return `${Number(seconds)}s`;
  const total = Math.max(0, Math.floor(Number(seconds)));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

const formatDateTime = (value) => value
  ? new Date(value).toLocaleString("en-IN")
  : "—";

const displayNumber = (value, suffix = "") =>
  value == null || value === "" ? "—" : `${value}${suffix}`;

const formatStatus = (value) => value
  ? value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  : "—";

function FinalResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getFinalResults()
      .then((response) => setResults(response.results || []))
      .catch((error) => {
        setLoadError(true);
        toast.error(error.response?.data?.message || "Failed to load final results.");
      })
      .finally(() => setLoading(false));
    logActivity("Viewed Final Results");
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">Examination records</p>
          <h1 className="mt-1 text-3xl font-bold text-[#103f7c] sm:text-4xl">Final Results</h1>
          <p className="mt-2 text-slate-600">Published results and submitted attempts for your final examinations.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#103f7c] border-t-transparent" />
            <p className="font-medium text-slate-600">Loading results…</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Results could not be loaded</h2>
            <p className="mt-2 text-slate-500">Please try again in a moment.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">No published results yet</h2>
            <p className="mt-2 text-slate-500">Results will appear here when they are published for your exams.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {results.map(({ exam, attempts }) => (
              <section key={exam.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{exam.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{exam.category || "Final exam"}{exam.testId ? ` · ${exam.testId}` : ""}</p>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Results published</span>
                </div>

                {attempts.length ? (
                  <div className="overflow-x-auto">
                    <p className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 sm:px-6">
                      Most recent attempt
                    </p>
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-3 font-semibold sm:px-6">Attempt</th>
                          <th className="px-5 py-3 font-semibold">Date</th>
                          <th className="px-5 py-3 font-semibold">Marks</th>
                          <th className="px-5 py-3 font-semibold">Percentage</th>
                          <th className="px-5 py-3 font-semibold">Time spent</th>
                          <th className="px-5 py-3 font-semibold">Correct / Wrong / Unanswered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attempts.map((attempt, index) => {
                          const percentage = attempt.percentage ?? (
                            attempt.score != null && Number(attempt.totalMarks) > 0
                              ? (Number(attempt.score) / Number(attempt.totalMarks) * 100).toFixed(2)
                              : null
                          );
                          return (
                            <tr key={attempt.id || index}>
                              <td className="whitespace-nowrap px-5 py-4 font-medium sm:px-6">{attempt.attemptNumber ? `Attempt ${attempt.attemptNumber}` : `Attempt ${attempts.length - index}`}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDateTime(attempt.submittedAt)}</td>
                              <td className="whitespace-nowrap px-5 py-4 font-semibold">{displayNumber(attempt.score)}{attempt.totalMarks != null ? ` / ${attempt.totalMarks}` : ""}</td>
                              <td className="whitespace-nowrap px-5 py-4">{displayNumber(percentage, "%")}</td>
                              <td className="whitespace-nowrap px-5 py-4">{formatTime(attempt.timeTaken)}</td>
                              <td className="whitespace-nowrap px-5 py-4 text-slate-600">{displayNumber(attempt.correctAnswers)} / {displayNumber(attempt.wrongAnswers)} / {displayNumber(attempt.unanswered)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="grid gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
                      {[
                        ["Attempt status", formatStatus(attempts[0].status)],
                        ["Exam type", attempts[0].examType],
                        ["Test title", attempts[0].testTitle],
                        ["Exam category", attempts[0].examCategory],
                        ["Attempt started", formatDateTime(attempts[0].startedAt)],
                        ["Attempt submitted", formatDateTime(attempts[0].submittedAt)],
                        ["Browser", attempts[0].browser],
                        ["Attempt test ID", attempts[0].testId],
                        ["Test record ID", attempts[0].testMongoId],
                        ["Record created", formatDateTime(attempts[0].createdAt)],
                        ["Record updated", formatDateTime(attempts[0].updatedAt)],
                      ].filter(([, value]) => value != null && value !== "").map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
                          <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="px-6 py-5 text-sm text-slate-500">No submitted attempt was found for this exam.</p>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FinalResult;
