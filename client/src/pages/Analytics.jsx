import { useEffect, useState } from "react";
import { getAnalytics } from "../services/mockTestService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response);
    } catch (error) {
      alert(error.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }

    return `${mins} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold text-[#103f7c]">
          Loading Analytics...
        </h2>
      </div>
    );
  }

  if (!analytics || !analytics.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl font-semibold">
          No analytics available.
        </h2>
      </div>
    );
  }

  const { overall } = analytics;

  
    return (
  <div className="min-h-screen bg-gray-100">
    <Navbar />

    <div className="py-8">
      <div className="mx-auto max-w-7xl px-5">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#103f7c]">
            Analytics Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Track your examination performance.
          </p>
        </div>

        {/* Overall Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Attempts</p>
            <h2 className="mt-2 text-3xl font-bold">
              {overall.totalAttempts}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Average Percentage</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {overall.averagePercentage}%
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Best Percentage</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {overall.bestPercentage}%
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Practice Time</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {formatTime(overall.totalTimeTaken)}
            </h2>
          </div>

        </div>

        {/* Exam-wise Analytics */}

        {Object.values(analytics.analytics).map((exam) => (
          <div
            key={exam.examType}
            className="mb-10 rounded-xl bg-white p-6 shadow"
          >
            <h2 className="text-2xl font-bold text-[#103f7c]">
              {exam.examType}
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-4">

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-gray-600">Attempts</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {exam.totalAttempts}
                </h3>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-gray-600">Average Score</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {exam.averageScore}
                </h3>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-gray-600">Average Percentage</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {exam.averagePercentage}%
                </h3>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-gray-600">Best Percentage</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {exam.bestPercentage}%
                </h3>
              </div>

            </div>

            {/* Attempt History */}

            <div className="mt-8 overflow-x-auto">

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
                    <tr
                      key={attempt.attemptId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        Attempt {attempt.attemptNumber}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(
                          attempt.submittedAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3">
                        {attempt.score}/{attempt.totalMarks}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        {attempt.percentage}%
                      </td>

                      <td className="px-4 py-3">
                        {formatTime(attempt.timeTaken)}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
     </div>
  );
}

export default Analytics;