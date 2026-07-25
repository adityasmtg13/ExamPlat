import Navbar from "../components/Navbar";
import {
  FaUserCircle,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaUniversity,
  FaCheckCircle,
} from "react-icons/fa";
import { getStudent } from "../storage";

function Dashboard() {
  const student = getStudent();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <section className="bg-white rounded-3xl shadow-md border border-gray-200 p-8 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#103f7c]">
                Welcome, {student?.name}
              </h2>
              <p className="text-gray-600 mt-3">
                National Exam Platform Student Dashboard
              </p>
            </div>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-6 h-px bg-[#103f7c]/10" />
        </section>

        <div className="grid xl:grid-cols-[1.4fr_1fr] gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-md border-l-4 border-[#103f7c] p-8 hover:shadow-xl transition">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#103f7c]">Profile Summary</h3>
                  <p className="text-gray-600 mt-3">Student information and contact details.</p>
                </div>
                <div className="rounded-full bg-[#f1f5f9] px-4 py-2 text-sm text-gray-600">
                  Official dashboard overview
                </div>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#eff6ff] flex items-center justify-center text-3xl text-[#103f7c]">
                    {student?.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#103f7c]">{student?.name || "Student"}</p>
                    <p className="text-gray-500">{student?.email || "No email provided"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#f8fafc] rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Phone</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.phone || "--"}</p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Stream</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.stream || "--"}</p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Class</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.studentClass || "--"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md border-l-4 border-green-600 p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#103f7c]">Latest Notifications</h3>
              <div className="mt-6 space-y-4 text-gray-700">
                <div className="rounded-2xl bg-[#ecf5ff] p-4 flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1" />
                  <p>JEE Main Mock Test Portal Available</p>
                </div>
                <div className="rounded-2xl bg-[#ecf5ff] p-4 flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1" />
                  <p>New Analytics Update Released</p>
                </div>
                <div className="rounded-2xl bg-[#ecf5ff] p-4 flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1" />
                  <p>Rank Predictor Improved</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md border-l-4 border-blue-700 p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#103f7c]">Quick Services</h3>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <FaClipboardList className="text-blue-700 text-4xl mb-4" />
                  <h4 className="font-semibold text-xl">Mock Tests</h4>
                  <p className="text-gray-600 mt-2">Practice AI-generated exams.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <FaChartBar className="text-orange-500 text-4xl mb-4" />
                  <h4 className="font-semibold text-xl">Analytics</h4>
                  <p className="text-gray-600 mt-2">View performance insights.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <FaUserGraduate className="text-pink-500 text-4xl mb-4" />
                  <h4 className="font-semibold text-xl">Rank Predictor</h4>
                  <p className="text-gray-600 mt-2">Estimate your exam rank.</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <FaUniversity className="text-yellow-600 text-4xl mb-4" />
                  <h4 className="font-semibold text-xl">College Predictor</h4>
                  <p className="text-gray-600 mt-2">Explore college matches.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md border-l-4 border-green-600 p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#103f7c]">Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#f8fafc] rounded-xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Mock Tests Attempted</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">0</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Predicted AIR</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Percentile</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Accuracy</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md border-l-4 border-[#103f7c] p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#103f7c]">Student Details</h3>
              <div className="mt-6 space-y-4 text-gray-700">
                <p><span className="font-semibold">Name:</span> {student?.name || "--"}</p>
                <p><span className="font-semibold">Email:</span> {student?.email || "--"}</p>
                <p><span className="font-semibold">Phone:</span> {student?.phone || "--"}</p>
                <p><span className="font-semibold">Stream:</span> {student?.stream || "--"}</p>
                <p><span className="font-semibold">Class:</span> {student?.studentClass || "--"}</p>
                <p><span className="font-semibold">School:</span> --</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 bg-[#082b5a] text-white rounded-3xl shadow-md overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-5">National Exam Platform</h2>
              <p className="leading-8 text-gray-300">An official student portal for national exam preparation and analytics.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-5">Government of India</h3>
              <p className="text-gray-300">Ministry of Education</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-5">Contact</h3>
              <p className="text-gray-300">support@nexam.gov.in</p>
              <p className="text-gray-300">1800-000-0000</p>
            </div>
          </div>
          <div className="border-t border-blue-700 py-5 text-center text-gray-300">
            © 2026 National Exam Platform
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
