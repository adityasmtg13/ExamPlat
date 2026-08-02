import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getMockTestById, startMockAttempt, submitAndRestartMockAttempt } from "../services/mockTestService";

function MockInstructions() {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      const data = await getMockTestById(testId);
      setTest(data.test);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Unable to load mock test.");
      navigate("/mock-tests");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      setStarting(true);

      const response = await startMockAttempt(testId);
      navigate(`/mock-test/exam/${response.attempt._id}`);
    } catch (error) {
      if (error.activeAttempt) {
        const submitPrevious = window.confirm(
          "You already have a mock test in progress. Do you want to submit it and start a new one?"
        );

        if (!submitPrevious) {
          return;
        }

        try {
          const response = await submitAndRestartMockAttempt(testId);
          navigate(`/mock-test/exam/${response.attempt._id}`);
        } catch (restartError) {
          toast.error(
            restartError?.message ||
              restartError?.response?.data?.message ||
              "Failed to submit the previous attempt."
          );
        }
      } else {
        toast.error(error.message || "Unable to start the selected test.");
      }
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-xl font-semibold text-[#103f7c]">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-[#103f7c]">Mock Test Instructions</h1>
          <p className="mb-8 text-gray-600">
            Please read all instructions carefully before starting the selected test.
          </p>

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Selected Test</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="font-semibold">Test ID</span>
                <p>{test.testId}</p>
              </div>
              <div>
                <span className="font-semibold">Title</span>
                <p>{test.title}</p>
              </div>
              <div>
                <span className="font-semibold">Exam Category</span>
                <p>{test.examCategory}</p>
              </div>
              <div>
                <span className="font-semibold">Subject</span>
                <p>{test.subject || "-"}</p>
              </div>
              <div>
                <span className="font-semibold">Status</span>
                <p>{test.status}</p>
              </div>
              <div>
                <span className="font-semibold">Maximum Attempts</span>
                <p>{test.maximumAttempts || test.defaultAttempts || 1}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Schedule</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="font-semibold">Start At</span>
                <p>{new Date(test.defaultStartAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">End At</span>
                <p>{new Date(test.defaultEndAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">Attempts Used</span>
                <p>{test.attemptsUsed}</p>
              </div>
              <div>
                <span className="font-semibold">Attempts Remaining</span>
                <p>{test.remainingAttempts}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">General Instructions</h2>
            <ol className="list-decimal space-y-3 pl-5 text-gray-700">
              <li>Read every question carefully before answering.</li>
              <li>Responses are stored locally until submission.</li>
              <li>Use the navigation buttons to move between questions.</li>
              <li>Submit the examination once completed.</li>
              <li>Only eligible mapped students can attempt this test.</li>
            </ol>
          </div>

          <div className="rounded-xl border bg-gray-50 p-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className="mt-1 h-5 w-5"
              />
              <span className="text-gray-700">
                I have read and understood the instructions for this selected mock test.
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={!accepted || starting || !test.canAttempt}
              onClick={handleStart}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
                accepted && !starting && test.canAttempt
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {starting ? "Starting..." : test.canAttempt ? "Start Test" : "Not Available"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInstructions;