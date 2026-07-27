import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import QuickServiceCard from "../components/QuickServiceCard";
import { getAnalytics } from "../services/mockTestService";
import Footer from "../components/Footer";
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
import logo from "../assets/logo.png";

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(getStudent());
  const [analytics, setAnalytics] = useState(null);

  const profileCompleted = isProfileComplete(student);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  useEffect(() => {
    const syncStudent = () => setStudent(getStudent());

    syncStudent();
    fetchAnalytics();

    window.addEventListener("studentUpdated", syncStudent);

    return () => {
      window.removeEventListener("studentUpdated", syncStudent);
    };
  }, []);

  const handleRegisterClick = () => {
    if (!profileCompleted) {
      toast.error(
        "Please complete your profile fully before proceeding with examination registration.",
        {
          position: "top-center",
          duration: 4000,
        }
      );

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
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Rank Predictor",
      description: "Estimate your exam rank.",
      icon: <FaUserGraduate />,
      iconClassName: "text-pink-500",
      onClick: () => navigate("/rank-predictor"),
    },
    {
      title: "College Predictor",
      description: "Explore college matches.",
      icon: <FaUniversity />,
      iconClassName: "text-yellow-600",
      onClick: () => navigate("/college-predictor"),
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
      tooltip: profileCompleted
        ? ""
        : "Fill all profile details correctly to proceed with examination registration.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
          <div className="grid gap-8 bg-slate-950 px-6 py-8 text-white md:grid-cols-[1fr_auto] md:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                src={logo}
                alt="National Exam Platform logo"
                className="h-16 w-16 rounded-xl bg-white p-2"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  National Exam Platform
                </p>
                <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                  Welcome, {student?.name || "Student"}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Manage exam registration, preparation tools, analytics, and profile details
                  from your official student dashboard.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 md:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Today
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div
                className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  profileCompleted
                    ? "bg-emerald-400/15 text-emerald-200"
                    : "bg-amber-400/15 text-amber-200"
                }`}
              >
                {profileCompleted ? "Profile Complete" : "Profile Pending"}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Student Profile
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Profile Summary</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-600 hover:text-cyan-700"
                >
                  Update Profile
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-5">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-cyan-50 text-4xl text-cyan-800">
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
                    <p className="text-lg font-bold text-slate-950">
                      {student?.name || "Student"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {student?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Phone
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">{student?.phone || "--"}</p>
                  </div> */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Stream
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">{student?.stream || "--"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Class
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {student?.studentClass || "--"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                    Services
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Quick Services</h2>
                </div>
                <p className="text-sm text-slate-500">Choose a service to continue.</p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Updates
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Latest Notifications</h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <FaCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700">
                    JEE Main Mock Test Portal Available
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <FaCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700">
                    New Analytics Update Released
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <FaCheckCircle className="mt-1 shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700">Rank Predictor Improved</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Performance
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Statistics</h2>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Mock Tests
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {analytics?.overall?.totalAttempts ?? 0}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    AIR
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">--</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Percentile
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">--</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Average Percentile
                  </p>

                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {analytics?.overall?.averagePercentile?.toFixed(2) ?? "0.00"}%
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Records
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Student Details</h2>

              <div className="mt-6 divide-y divide-slate-100 text-sm">
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Name</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.name || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.email || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Phone</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.phone || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Stream</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.stream || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Class</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.studentClass || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">School</span>
                  <span className="text-right font-medium text-slate-900">
                    {student?.school || "--"}
                  </span>
                </p>
                <p className="flex justify-between gap-4 py-3">
                  <span className="font-semibold text-slate-500">Exams Registered</span>
                  <span className="text-right font-medium text-slate-900">
                    {analytics?.overall?.totalRegistrations ?? 0}
                  </span>
                </p>
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
