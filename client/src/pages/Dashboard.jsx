import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import QuickServiceCard from "../components/QuickServiceCard";
import { getAnalytics } from "../services/mockTestService";
import { getAuditLogs, logActivity } from "../services/auditService";
import { getRegistrationHistory } from "../services/registrationService";
import Footer from "../components/Footer";
import {
  FaUserCircle,
  FaUserGraduate,
  FaClipboardList,
  FaChartBar,
  FaUniversity,
  FaCheckCircle,
  FaFileAlt,
  FaSignInAlt,
  FaUserEdit,
  FaMoneyCheckAlt,
  FaChartLine,
  FaFilePdf,
  FaClipboardCheck,
  FaHistory,
  FaChevronRight,
} from "react-icons/fa";
import { getStudent } from "../storage";
import { isProfileComplete } from "../utils/profileUtils";
import logo from "../assets/logo.png";

const getAuditIcon = (action) => {
  const value = String(action || "").toLowerCase();

  if (value.includes("login")) return <FaSignInAlt className="text-blue-600" />;
  if (value.includes("register") || value.includes("registered")) return <FaUserEdit className="text-emerald-600" />;
  if (value.includes("profile") || value.includes("updated")) return <FaUserEdit className="text-violet-600" />;
  if (value.includes("payment")) return <FaMoneyCheckAlt className="text-green-600" />;
  if (value.includes("receipt")) return <FaFilePdf className="text-red-600" />;
  if (value.includes("mock") || value.includes("test")) return <FaClipboardCheck className="text-cyan-600" />;
  if (value.includes("analytics")) return <FaChartLine className="text-indigo-600" />;
  return <FaHistory className="text-slate-600" />;
};

const getAuditIconBg = (action) => {
  const value = String(action || "").toLowerCase();

  if (value.includes("login")) return "bg-blue-50";
  if (value.includes("register") || value.includes("registered")) return "bg-emerald-50";
  if (value.includes("profile") || value.includes("updated")) return "bg-violet-50";
  if (value.includes("payment")) return "bg-green-50";
  if (value.includes("receipt")) return "bg-red-50";
  if (value.includes("mock") || value.includes("test")) return "bg-cyan-50";
  if (value.includes("analytics")) return "bg-indigo-50";
  return "bg-slate-50";
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? "" : "s"} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? "" : "s"} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) === 1 ? "" : "s"} ago`;
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(getStudent());
  const [analytics, setAnalytics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [registeredExamsCount, setRegisteredExamsCount] = useState(0);

  const profileCompleted = isProfileComplete(student);

  const fetchAnalytics = async () => {
    try {
      const response = await getAnalytics();
      setAnalytics(response);
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await getAuditLogs();
      setAuditLogs((response.logs || []).slice(0, 3));
    } catch (error) {
      console.error("Audit Logs Error:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await getRegistrationHistory();
      const registrations = response.registrations || response || [];
      const count = registrations.filter(
        (reg) => reg.status === "Registered"
      ).length;
      setRegisteredExamsCount(count);
    } catch (error) {
      console.error("Registrations Error:", error);
    }
  };

  useEffect(() => {
    const syncStudent = () => setStudent(getStudent());

    syncStudent();
    fetchAnalytics();
    fetchAuditLogs();
    fetchRegistrations();
    logActivity("Viewed Dashboard");

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
      title: "Marks",
      description: "View score summaries and attempt history.",
      icon: <FaChartBar />,
      iconClassName: "text-orange-500",
      onClick: () => navigate("/marks"),
    },
    {
      title: "Analytics",
      description: "Track performance, trends, and progress.",
      icon: <FaUserGraduate />,
      iconClassName: "text-pink-500",
      onClick: () => navigate("/analytics"),
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
                alt="ExamPlat logo"
                className="h-16 w-16 rounded-xl bg-white p-2"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  ExamPlat - e-Examination Platform
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
                  </div>  
                   {/* <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Stream
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">{student?.stream || "--"}</p>
                  </div> */}
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
                    {registeredExamsCount}
                  </span>
                </p>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_0.85fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                Updates
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">Latest Notifications</h2>
            </div>

            <div className="mt-6 grid gap-4">
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

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-700">
                  Activity
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Audit Logs</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {auditLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <FaHistory className="mx-auto text-2xl text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    No audit logs available.
                  </p>
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-cyan-200 hover:bg-cyan-50/40"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${getAuditIconBg(log.action)}`}>
                      {getAuditIcon(log.action)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {log.action}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatRelativeTime(log.createdAt)} · {formatTime(log.createdAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>

                <button
                  type="button"
                  onClick={() => navigate("/audit-logs")}
                  className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"
                >
                  View More
                  <FaChevronRight className="text-xs" />
                </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
