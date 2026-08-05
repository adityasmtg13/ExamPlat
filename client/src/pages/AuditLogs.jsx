import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAuditLogs, logActivity } from "../services/auditService";
import {
  FaSignInAlt,
  FaUserEdit,
  FaMoneyCheckAlt,
  FaChartLine,
  FaFilePdf,
  FaClipboardCheck,
  FaUserPlus,
  FaKey,
  FaCamera,
  FaTrash,
  FaFileAlt,
  FaHistory,
  FaTimes,
} from "react-icons/fa";

const getActionIcon = (action) => {
  const value = String(action || "").toLowerCase();

  if (value.includes("login")) return <FaSignInAlt />;
  if (value.includes("register") || value.includes("registered")) return <FaUserPlus />;
  if (value.includes("profile") || value.includes("updated")) return <FaUserEdit />;
  if (value.includes("photo")) return value.includes("deleted") ? <FaTrash /> : <FaCamera />;
  if (value.includes("payment")) return <FaMoneyCheckAlt />;
  if (value.includes("receipt")) return <FaFilePdf />;
  if (value.includes("mock") || value.includes("test")) return <FaClipboardCheck />;
  if (value.includes("analytics")) return <FaChartLine />;
  if (value.includes("password") || value.includes("forgot")) return <FaKey />;
  if (value.includes("exam") || value.includes("registration")) return <FaFileAlt />;
  return <FaHistory />;
};

const getIconColor = (action) => {
  const value = String(action || "").toLowerCase();

  if (value.includes("login")) return "bg-blue-50 text-blue-700";
  if (value.includes("register") || value.includes("registered")) return "bg-emerald-50 text-emerald-700";
  if (value.includes("profile") || value.includes("updated")) return "bg-violet-50 text-violet-700";
  if (value.includes("photo")) return "bg-pink-50 text-pink-700";
  if (value.includes("payment")) return "bg-green-50 text-green-700";
  if (value.includes("receipt")) return "bg-red-50 text-red-700";
  if (value.includes("mock") || value.includes("test")) return "bg-cyan-50 text-cyan-700";
  if (value.includes("analytics")) return "bg-indigo-50 text-indigo-700";
  if (value.includes("password") || value.includes("forgot")) return "bg-amber-50 text-amber-700";
  if (value.includes("exam") || value.includes("registration")) return "bg-orange-50 text-orange-700";
  return "bg-slate-50 text-slate-700";
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
    logActivity("Viewed Audit Logs");
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await getAuditLogs();
      setLogs(response.logs || []);
    } catch (error) {
      toast.error(error.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
          <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Account Activity
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Audit Logs</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Track all activities performed on your account.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-700" />
                  <h2 className="text-xl font-bold text-slate-950">Loading audit logs</h2>
                  <p className="mt-2 text-sm text-slate-500">Retrieving your account activity.</p>
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-700">
                    <FaHistory />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-slate-950">No audit logs available.</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                    Your account activity will appear here as you use the platform.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Activity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr
                        key={log._id}
                        onClick={() => setSelectedLog(log)}
                        className="cursor-pointer transition hover:bg-cyan-50/50"
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${getIconColor(log.action)}`}>
                              {getActionIcon(log.action)}
                            </div>
                            <span className="font-semibold text-slate-900">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{log.description}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {log.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                          {formatTime(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Details Panel */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg ${getIconColor(selectedLog.action)}`}>
                  {getActionIcon(selectedLog.action)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{selectedLog.action}</h3>
                  <p className="text-sm text-slate-500">{formatRelativeTime(selectedLog.createdAt)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Description
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {selectedLog.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {selectedLog.status}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Date & Time
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(selectedLog.createdAt)} · {formatTime(selectedLog.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AuditLogs;