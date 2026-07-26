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
    icon: <FaCalculator className="text-[#103f7c]" />,
    accent: "from-blue-600 to-indigo-700",
  },

  NEET: {
    title: "NEET Mock Test",
    body: "National Testing Agency",
    duration: "3 Hours 20 Minutes",
    questions: "180",
    marks: "720",
    sections: ["Physics", "Chemistry", "Botany", "Zoology"],
    icon: <FaFlask className="text-emerald-600" />,
    accent: "from-emerald-600 to-green-700",
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
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-xl font-semibold text-[#103f7c]">
            Loading Mock Tests...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#103f7c]">
            Mock Tests
          </h1>

          <p className="mt-3 text-gray-600">
            Practice using official examination patterns before your real exam.
          </p>
        </div>

        {mockTests.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Registered Exams
            </h2>

            <p className="mt-3 text-gray-500">
              Register for an examination to unlock mock tests.
            </p>

            <button
              onClick={() => navigate("/register-exam")}
              className="mt-6 rounded-xl bg-[#103f7c] px-6 py-3 font-semibold text-white hover:bg-[#0b2d57]"
            >
              Register Examination
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">

            {mockTests.map((test) => {

              const details = examDetails[test.examType];

              return (
                <div
                  key={test.registrationId}
                  className="rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`rounded-t-3xl bg-gradient-to-r ${details.accent} p-6 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">
                        {details.icon}
                      </div>

                      <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                        {details.body}
                      </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                      {details.title}
                    </h2>

                    <p className="mt-2 text-sm">
                      Registration No : {test.registrationNumber}
                    </p>
                  </div>

                  <div className="space-y-3 p-6">

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Duration
                      </span>

                      <span>{details.duration}</span>
                    </div>

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Questions
                      </span>

                      <span>{details.questions}</span>
                    </div>

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Maximum Marks
                      </span>

                      <span>{details.marks}</span>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="mb-2 font-semibold">
                        Sections
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {details.sections.map((section) => (
                          <span
                            key={section}
                            className="rounded-full bg-white px-3 py-1 text-sm text-[#103f7c] shadow"
                          >
                            {section}
                          </span>
                        ))}

                      </div>
                    </div>

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Registration Status
                      </span>

                      <span
                        className={`font-bold ${
                          test.registrationStatus === "Registered"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {test.registrationStatus}
                      </span>
                    </div>

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Attempts Used
                      </span>

                      <span>
                        {test.attemptsUsed} / {test.maximumAttempts}
                      </span>
                    </div>

                    <div className="flex justify-between rounded-lg bg-gray-50 p-3">
                      <span className="font-semibold">
                        Remaining Attempts
                      </span>

                      <span>
                        {test.remainingAttempts}
                      </span>
                    </div>

                    {test.canAttempt ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/mock-test/instructions/${test.registrationId}`
                          )
                        }
                        className="mt-4 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                      >
                        Take Mock Test
                      </button>
                    ) : (
                      <button
                        disabled
                        className="mt-4 w-full cursor-not-allowed rounded-xl bg-gray-400 py-3 font-semibold text-white"
                      >
                        {test.registrationStatus === "Pending Payment"
                          ? "Complete Registration Payment"
                          : "Maximum Attempts Reached"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockTests;