import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import QuickServiceCard from "../components/QuickServiceCard";
import {
  FaUserCircle,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaUniversity,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import { getStudent } from "../storage";
import { isProfileComplete } from "../utils/profileUtils";

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(getStudent());

  useEffect(() => {
    const syncStudent = () => setStudent(getStudent());

    syncStudent();
    window.addEventListener("studentUpdated", syncStudent);

    return () => window.removeEventListener("studentUpdated", syncStudent);
  }, []);

  const profileCompleted = isProfileComplete(student);

  const handleRegisterClick = () => {
    if (!profileCompleted) {
      toast.error("Please complete and validate all profile details before registering for the examination.");
      return;
    }

    navigate("/register-exam");
  };

  const quickServices = [
    {
      title: "Mock Tests",
      description: "Practice AI-generated exams.",
      icon: <FaClipboardList />,
      iconClassName: "text-blue-700",
      onClick: () => navigate("/mock-tests"),
    },
    {
      title: "AI Analytics",
      description: "View performance insights.",
      icon: <FaChartBar />,
      iconClassName: "text-orange-500",
    },
    {
      title: "Rank Predictor",
      description: "Estimate your exam rank.",
      icon: <FaUserGraduate />,
      iconClassName: "text-pink-500",
    },
    {
      title: "College Predictor",
      description: "Explore college matches.",
      icon: <FaUniversity />,
      iconClassName: "text-yellow-600",
    },
    {
      title: "Profile",
      description: "Review and complete your student profile.",
      icon: <FaUserCircle />,
      iconClassName: "text-[#103f7c]",
      onClick: () => navigate("/profile"),
    },
    {
      title: "Register for Exam",
      description: "Proceed to exam registration.",
      icon: <FaFileAlt />,
      iconClassName: "text-green-600",
      onClick: handleRegisterClick,
      disabled: !profileCompleted,
      status: profileCompleted ? "valid" : "invalid",
      tooltip: profileCompleted ? "" : "Fill all profile details correctly to proceed with examination registration.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#103f7c] md:text-4xl">
                Welcome, {student?.name}
              </h2>
              <p className="mt-3 text-gray-600">
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

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border-l-4 border-[#103f7c] bg-white p-8 shadow-md transition hover:shadow-xl">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#103f7c]">Profile Summary</h3>
                  <p className="mt-3 text-gray-600">Student information and contact details.</p>
                </div>
                <div className="rounded-full bg-[#f1f5f9] px-4 py-2 text-sm text-gray-600">
                  Official dashboard overview
                </div>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#eff6ff] text-3xl text-[#103f7c]">
                    {student?.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt="Profile"
                        className="h-full w-full object-cover"
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
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Phone</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.phone || "--"}</p>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Stream</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.stream || "--"}</p>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Class</p>
                    <p className="mt-2 font-semibold text-gray-800">{student?.studentClass || "--"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-l-4 border-green-600 bg-white p-8 shadow-md transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-[#103f7c]">Latest Notifications</h3>
              <div className="mt-6 space-y-4 text-gray-700">
                <div className="flex items-start gap-3 rounded-2xl bg-[#ecf5ff] p-4">
                  <FaCheckCircle className="mt-1 text-green-600" />
                  <p>JEE Main Mock Test Portal Available</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-[#ecf5ff] p-4">
                  <FaCheckCircle className="mt-1 text-green-600" />
                  <p>New Analytics Update Released</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-[#ecf5ff] p-4">
                  <FaCheckCircle className="mt-1 text-green-600" />
                  <p>Rank Predictor Improved</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-l-4 border-blue-700 bg-white p-8 shadow-md transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-[#103f7c]">Quick Services</h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {quickServices.map((service) => (
                  <QuickServiceCard
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    onClick={service.onClick}
                    disabled={service.disabled}
                    iconClassName={service.iconClassName}
                    status={service.status}
                    tooltip={service.tooltip}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border-l-4 border-green-600 bg-white p-8 shadow-md transition hover:shadow-xl">
              <h3 className="text-xl font-semibold text-[#103f7c]">Statistics</h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#f8fafc] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Mock Tests Attempted</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">0</p>
                </div>
                <div className="rounded-xl bg-[#f8fafc] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Predicted AIR</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
                <div className="rounded-xl bg-[#f8fafc] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Percentile</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
                <div className="rounded-xl bg-[#f8fafc] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Accuracy</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border-l-4 border-[#103f7c] bg-white p-8 shadow-md transition hover:shadow-xl">
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

        <footer className="mt-12 overflow-hidden rounded-3xl bg-[#082b5a] text-white shadow-md">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
            <div>
              <h2 className="mb-5 text-2xl font-bold">National Exam Platform</h2>
              <p className="leading-8 text-gray-300">An official student portal for national exam preparation and analytics.</p>
            </div>
            <div>
              <h3 className="mb-5 text-xl font-bold">Government of India</h3>
              <p className="text-gray-300">Ministry of Education</p>
            </div>
            <div>
              <h3 className="mb-5 text-xl font-bold">Contact</h3>
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
