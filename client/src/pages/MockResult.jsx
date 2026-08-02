import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMockResult } from "../services/mockTestService";

const MockResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const response = await getMockResult(attemptId);
      setResult(response.result);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }

    return `${mins}m ${secs}s`;
  };

  const getBadge = (percentage) => {
    if (percentage >= 90)
      return {
        title: "🏆 Outstanding",
        color: "text-green-700",
      };

    if (percentage >= 80)
      return {
        title: "🥇 Excellent",
        color: "text-green-600",
      };

    if (percentage >= 70)
      return {
        title: "🥈 Very Good",
        color: "text-blue-600",
      };

    if (percentage >= 60)
      return {
        title: "🥉 Good",
        color: "text-yellow-600",
      };

    if (percentage >= 40)
      return {
        title: "📘 Average",
        color: "text-orange-600",
      };

    return {
      title: "📖 Needs Improvement",
      color: "text-red-600",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Result...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Result not found.
      </div>
    );
  }

  const badge = getBadge(result.percentage);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Mock Test Result
        </h1>

        <hr className="my-6" />

        {/* Candidate Information */}

        <h2 className="text-xl font-semibold mb-3">
          Candidate Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <strong>Test ID:</strong> {result.testId}
          </div>

          <div>
            <strong>Exam:</strong> {result.testTitle || result.examType}
          </div>

          <div>
            <strong>Attempt:</strong> {result.attemptNumber} / {result.maximumAttempts || 1}
          </div>

          <div>
            <strong>Submitted On:</strong>{" "}
            {new Date(result.submittedAt).toLocaleString()}
          </div>

        </div>

        <hr className="my-6" />

        {/* Score */}

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Overall Performance
          </h2>

          <p className="text-5xl font-bold text-green-600 mt-4">
            {result.score} / {result.totalMarks}
          </p>

          <p className="text-xl mt-3">
            {result.percentage.toFixed(2)}%
          </p>

        </div>

        <hr className="my-6" />

        {/* Statistics */}

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-green-100 rounded-lg p-5 text-center">
            <h3 className="font-semibold">Correct</h3>
            <p className="text-3xl font-bold">
              {result.correctAnswers}
            </p>
          </div>

          <div className="bg-red-100 rounded-lg p-5 text-center">
            <h3 className="font-semibold">Wrong</h3>
            <p className="text-3xl font-bold">
              {result.wrongAnswers}
            </p>
          </div>

          <div className="bg-yellow-100 rounded-lg p-5 text-center">
            <h3 className="font-semibold">Unanswered</h3>
            <p className="text-3xl font-bold">
              {result.unanswered}
            </p>
          </div>

        </div>

        <hr className="my-6" />

        {/* Time */}

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Time Taken
          </h2>

          <p className="text-2xl mt-2">
            {formatTime(result.timeTaken)}
          </p>

        </div>

        <hr className="my-6" />

        {/* Badge */}

        <div className="text-center">

          <h2 className="text-xl font-semibold">
            Performance
          </h2>

          <p className={`text-3xl mt-4 font-bold ${badge.color}`}>
            {badge.title}
          </p>

        </div>

        <hr className="my-6" />

        {/* Buttons */}

        <div className="flex flex-col md:flex-row justify-center gap-4">

          <button
            onClick={() => navigate("/mock-tests")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Attempt Another Mock
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    </div>
  );
};

export default MockResult;