import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



import { getRegistrationById } from "../services/registrationService";


import {
  startMockAttempt,
  submitAndRestartMockAttempt,
} from "../services/mockTestService";

const examDetails = {
  "JEE Main": {
    duration: "3 Hours",
    questions: 90,
    marks: 300,
    sections: ["Physics", "Chemistry", "Mathematics"],
  },

  NEET: {
    duration: "3 Hours 20 Minutes",
    questions: 180,
    marks: 720,
    sections: ["Physics", "Chemistry", "Botany", "Zoology"],
  },
};

function MockInstructions() {
  const navigate = useNavigate();
  const { registrationId } = useParams();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    loadRegistration();
  }, []);

  const loadRegistration = async () => {
    try {
      const data = await getRegistrationById(registrationId);
      setRegistration(data.registration);
    } catch (err) {
      console.error(err);
      alert("Unable to load examination.");
      navigate("/mock-tests");
    } finally {
      setLoading(false);
    }
  };

const handleStart = async () => {
  try {
    setStarting(true);

    const response = await startMockAttempt(registrationId);

    navigate(`/mock-test/exam/${response.attempt._id}`);
  } catch (err) {
    if (err.activeAttempt) {
      const submitPrevious = window.confirm(
        "You already have a mock test in progress.\n\nDo you want to submit it and start a new one?"
      );

      if (!submitPrevious) {
        setStarting(false);
        return;
      }

      try {
        const response = await submitAndRestartMockAttempt(
          registrationId
        );

        navigate(`/mock-test/exam/${response.attempt._id}`);
      } catch (restartErr) {
        console.log(restartErr);

alert(
  restartErr?.message ||
  restartErr?.response?.data?.message ||
  "Failed to submit the previous attempt."
);
      }
    } else {
      alert(err.message);
    }
  } finally {
    setStarting(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        

        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-xl font-semibold text-[#103f7c]">
            Loading...
          </h2>
        </div>
      </div>
    );
  }

  const exam = examDetails[registration.examType];

  return (
    <div className="min-h-screen bg-gray-100">
     

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <h1 className="mb-2 text-3xl font-bold text-[#103f7c]">
            Mock Test Instructions
          </h1>

          <p className="mb-8 text-gray-600">
            Please read all instructions carefully before
            starting your examination.
          </p>

          {/* Candidate Details */}

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Candidate Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="font-semibold">
                  Registration Number
                </span>
                <p>{registration.registrationNumber}</p>
              </div>

              <div>
                <span className="font-semibold">
                  Examination
                </span>
                <p>{registration.examType}</p>
              </div>

              <div>
                <span className="font-semibold">
                  Registration Status
                </span>
                <p>{registration.status}</p>
              </div>

              <div>
                <span className="font-semibold">
                  Registration Fee
                </span>
                <p>₹{registration.registrationFee}</p>
              </div>
            </div>
          </div>

          {/* Exam Details */}

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Examination Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <strong>Duration</strong>
                <p>{exam.duration}</p>
              </div>

              <div>
                <strong>Total Questions</strong>
                <p>{exam.questions}</p>
              </div>

              <div>
                <strong>Maximum Marks</strong>
                <p>{exam.marks}</p>
              </div>

              <div>
                <strong>Question Type</strong>
                <p>Multiple Choice Questions (MCQ)</p>
              </div>

              <div>
                <strong>Negative Marking</strong>
                <p>Yes (-1 for incorrect answer)</p>
              </div>

              <div>
                <strong>Maximum Attempts</strong>
                <p>3</p>
              </div>
            </div>

            <div className="mt-5">
              <strong>Sections</strong>

              <div className="mt-3 flex flex-wrap gap-2">
                {exam.sections.map((section) => (
                  <span
                    key={section}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}

          <div className="mb-8 rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">
              General Instructions
            </h2>

            <ol className="list-decimal space-y-3 pl-5 text-gray-700">
              <li>Read every question carefully before answering.</li>
              <li>Practice mode has no countdown timer.</li>
              <li>Each correct answer carries +4 marks.</li>
              <li>Each incorrect answer carries -1 mark.</li>
              <li>Unanswered questions carry 0 marks.</li>
              <li>Responses are stored locally until submission.</li>
              <li>Submit the examination once completed.</li>
              <li>Maximum three attempts are allowed.</li>
            </ol>
          </div>

          {/* Declaration */}

          <div className="rounded-xl border bg-gray-50 p-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) =>
                  setAccepted(e.target.checked)
                }
                className="mt-1 h-5 w-5"
              />

              <span className="text-gray-700">
                I hereby declare that I have read and
                understood all the instructions. I agree to
                attempt this mock examination fairly.
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={!accepted || starting}
              onClick={handleStart}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition ${
                accepted && !starting
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {starting ? "Starting..." : "Start Mock Test"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MockInstructions;