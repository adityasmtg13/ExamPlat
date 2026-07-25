import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaBookOpen, FaFlask, FaCalculator, FaBrain } from "react-icons/fa";

const mockTests = [
  {
    title: "JEE Main Mock Test",
    body: "National Testing Agency",
    duration: "3 Hours",
    questions: "90",
    marks: "300",
    sections: ["Physics", "Chemistry", "Mathematics"],
    negative: "Yes",
    pattern: "Official NTA Pattern",
    difficulty: "Mixed",
    attempts: "3 Attempts",
    remaining: "3 / 3",
    button: "Start Mock Test",
    icon: <FaCalculator className="text-[#103f7c]" />,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "NEET Mock Test",
    body: "National Testing Agency",
    duration: "3 Hours 20 Minutes",
    questions: "180",
    marks: "720",
    sections: ["Physics", "Chemistry", "Botany", "Zoology"],
    negative: "Yes",
    pattern: "Official NTA Pattern",
    difficulty: "Mixed",
    attempts: "3 Attempts",
    remaining: "3 / 3",
    button: "Start Mock Test",
    icon: <FaFlask className="text-emerald-600" />,
    accent: "from-emerald-600 to-green-700",
  }
];

function MockTests() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#103f7c] md:text-4xl">Mock Tests</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Prepare with nationally aligned mock assessments designed for serious aspirants.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {mockTests.map((test) => (
            <div
              key={test.title}
              className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`rounded-2xl bg-gradient-to-r ${test.accent} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{test.icon}</div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                    {test.body}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{test.title}</h2>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="font-semibold text-gray-600">Duration</span>
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="font-semibold text-gray-600">Questions</span>
                  <span>{test.questions}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="font-semibold text-gray-600">Maximum Marks</span>
                  <span>{test.marks}</span>
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-3 text-sm">
                  <p className="mb-2 font-semibold text-gray-600">Sections</p>
                  <div className="flex flex-wrap gap-2">
                    {test.sections.map((section) => (
                      <span key={section} className="rounded-full bg-white px-3 py-1 text-xs text-[#103f7c] shadow-sm">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">Attempts</span>
                  <span>{test.attempts}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">Remaining</span>
                  <span>{test.remaining}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-6 w-full rounded-xl bg-[#103f7c] px-4 py-3 font-semibold text-white transition hover:bg-[#0b2d57]"
              >
                {test.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MockTests;
