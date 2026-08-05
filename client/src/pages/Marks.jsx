import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAnalytics } from "../services/mockTestService";
import { logActivity } from "../services/auditService";

function Marks() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [expandedExams, setExpandedExams] = useState(() => new Set());

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response);
    } catch (error) {
      toast.error(error.message || "Failed to load marks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    logActivity("Viewed Marks");
  }, []);

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }

    return `${mins} min`;
  };

  const toggleExpand = (examType) => {
    setExpandedExams((prev) => {
      const next = new Set(prev);
      if (next.has(examType)) {
        next.delete(examType);
      } else {
        next.add(examType);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#103f7c] border-t-transparent" />
          <h2 className="text-2xl font-semibold text-[#103f7c]">Loading Marks...</h2>
        </div>
      </div>
    );
  }

  if (!analytics || !analytics.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">No marks available.</h2>
      </div>
    );
  }

  const { overall } = analytics;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#103f7c]">Marks</h1>
            <p className="mt-2 text-gray-600">Track your examination performance and score trends.</p>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-gray-500">Total Attempts</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">{overall.totalAttempts}</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-gray-500">Average Percentage</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-600">{overall.averagePercentage}%</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-gray-500">Best Percentage</p>
              <h2 className="mt-2 text-3xl font-bold text-green-600">{overall.bestPercentage}%</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-gray-500">Practice Time</p>
              <h2 className="mt-2 text-3xl font-bold text-purple-600">{formatTime(overall.totalTimeTaken)}</h2>
            </div>
          </div>

          {Object.values(analytics.analytics).map((exam) => {
            const isExpanded = expandedExams.has(exam.examType);

            return (
              <div
                key={exam.examType}
                className={`mb-10 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition ${
                  isExpanded ? "ring-2 ring-[#103f7c]" : "hover:shadow-lg"
                }`}
              >
                <div className="flex items-center gap-4 p-6">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-[#103f7c]">{exam.examType}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {exam.totalAttempts} attempt{exam.totalAttempts === 1 ? "" : "s"} · Best {exam.bestPercentage}% · Avg {exam.averagePercentage}%
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(exam.examType)}
                    aria-label={isExpanded ? "Collapse attempt history" : "Expand attempt history"}
                    aria-expanded={isExpanded}
                    title={isExpanded ? "Collapse details" : "View full details"}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition ${
                      isExpanded
                        ? "bg-[#103f7c] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                  </button>
                </div>

                {isExpanded && (
                  <>
                    <div className="grid gap-5 px-6 pb-6 md:grid-cols-4">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-gray-600">Attempts</p>
                        <h3 className="mt-2 text-2xl font-bold">{exam.totalAttempts}</h3>
                      </div>

                      <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-gray-600">Average Score</p>
                        <h3 className="mt-2 text-2xl font-bold">{exam.averageScore}</h3>
                      </div>

                      <div className="rounded-lg bg-yellow-50 p-4">
                        <p className="text-gray-600">Average Percentage</p>
                        <h3 className="mt-2 text-2xl font-bold">{exam.averagePercentage}%</h3>
                      </div>

                      <div className="rounded-lg bg-purple-50 p-4">
                        <p className="text-gray-600">Best Percentage</p>
                        <h3 className="mt-2 text-2xl font-bold">{exam.bestPercentage}%</h3>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 bg-gray-50/60 p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                          <thead className="bg-[#103f7c] text-white">
                            <tr>
                              <th className="px-4 py-3 text-left">Attempt</th>
                              <th className="px-4 py-3 text-left">Date</th>
                              <th className="px-4 py-3 text-left">Score</th>
                              <th className="px-4 py-3 text-left">Percentage</th>
                              <th className="px-4 py-3 text-left">Time Taken</th>
                            </tr>
                          </thead>

                          <tbody>
                            {exam.attempts.map((attempt) => (
                              <tr key={attempt.attemptId} className="border-t hover:bg-gray-50">
                                <td className="bg-white px-4 py-3">Attempt {attempt.attemptNumber}</td>
                                <td className="bg-white px-4 py-3">
                                  {new Date(attempt.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="bg-white px-4 py-3">
                                  {attempt.score}/{attempt.totalMarks}
                                </td>
                                <td className="bg-white px-4 py-3 font-semibold">{attempt.percentage}%</td>
                                <td className="bg-white px-4 py-3">{formatTime(attempt.timeTaken)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Marks;
