import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalytics } from "../services/mockTestService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MetricCard from "../components/MetricCard";
import ChartSection from "../components/ChartSection";
import ExamAnalyticsCard from "../components/ExamAnalyticsCard";
import RankPredictionModal from "../components/RankPredictionModal";

const COLORS = ["#0f5ec6", "#16a34a", "#f59e0b", "#8b5cf6", "#14b8a6"];

const normalizeExamName = (name = "") => {
  const value = String(name).trim().toUpperCase();
  if (value.includes("JEE")) return "JEE";
  if (value.includes("NEET")) return "NEET";
  if (value.includes("CUET")) return "CUET";
  if (value.includes("MAT")) return "MAT";
  return value || "General";
};

const formatDuration = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
};

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        setAnalytics(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const examGroups = useMemo(() => Object.values(analytics?.analytics || {}), [analytics]);

  const allAttempts = useMemo(
    () =>
      examGroups
        .flatMap((exam) =>
          exam.attempts.map((attempt) => ({
            ...attempt,
            examType: exam.examType,
            normalizedExam: normalizeExamName(exam.examType),
          }))
        )
        .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)),
    [examGroups]
  );

  const summary = useMemo(() => {
    const totalAttempts = analytics?.overall?.totalAttempts ?? 0;
    const averagePercentage = analytics?.overall?.averagePercentage ?? 0;
    const bestPercentage = analytics?.overall?.bestPercentage ?? 0;
    const lowestPercentage = allAttempts.length
      ? Math.min(...allAttempts.map((attempt) => Number(attempt.percentage || 0)))
      : 0;
    const totalQuestionsAttempted = examGroups.reduce(
      (sum, exam) =>
        sum + exam.attempts.reduce((attemptSum, attempt) => attemptSum + (attempt.totalMarks || 0), 0),
      0
    );
    const practiceTime = analytics?.overall?.totalTimeTaken ?? 0;

    return {
      totalAttempts,
      averagePercentage,
      bestPercentage,
      lowestPercentage,
      totalQuestionsAttempted,
      practiceTime,
    };
  }, [allAttempts, analytics, examGroups]);

  const performanceTrendData = useMemo(
    () =>
      allAttempts.map((attempt, index) => ({
        name: `A${index + 1}`,
        attempts: index + 1,
        percentage: Number(attempt.percentage || 0),
        score: Number(attempt.score || 0),
      })),
    [allAttempts]
  );

  const examAttemptData = useMemo(
    () =>
      ["JEE", "NEET", "CUET", "MAT"].map((examName) => {
        const exam = examGroups.find((item) => normalizeExamName(item.examType) === examName);

        return {
          name: examName,
          attempts: exam?.totalAttempts || 0,
        };
      }),
    [examGroups]
  );

  const comparisonData = useMemo(
    () =>
      ["JEE", "NEET", "CUET", "MAT"].map((examName) => {
        const exam = examGroups.find((item) => normalizeExamName(item.examType) === examName);

        return {
          name: examName,
          best: Number(exam?.bestPercentage || 0),
          average: Number(exam?.averagePercentage || 0),
        };
      }),
    [examGroups]
  );

  const practiceDistributionData = useMemo(
    () =>
      examGroups
        .map((exam) => ({
          name: normalizeExamName(exam.examType),
          value: exam.attempts.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0),
        }))
        .filter((item) => item.value > 0)
        .slice(0, 5),
    [examGroups]
  );

  const overallPerformanceData = useMemo(
    () =>
      allAttempts.map((attempt, index) => ({
        attempt: `Attempt ${index + 1}`,
        percentage: Number(attempt.percentage || 0),
      })),
    [allAttempts]
  );

  const examCards = useMemo(() => examGroups.map((exam) => ({ ...exam })), [examGroups]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 animate-pulse space-y-3">
            <div className="h-8 w-56 rounded-full bg-slate-200" />
            <div className="h-4 w-80 rounded-full bg-slate-200" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const summaryCards = [
    { label: "Total Mock Tests Attempted", value: summary.totalAttempts, accent: "blue" },
    { label: "Average Percentage", value: `${summary.averagePercentage}%`, accent: "emerald" },
    { label: "Highest Percentage", value: `${summary.bestPercentage}%`, accent: "violet" },
    { label: "Lowest Percentage", value: `${summary.lowestPercentage}%`, accent: "amber" },
    { label: "Total Questions Attempted", value: summary.totalQuestionsAttempted, accent: "slate" },
    { label: "Total Practice Hours", value: formatDuration(summary.practiceTime), accent: "blue" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Performance Intelligence</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Analytics Dashboard</h1>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            {examGroups.length} exam segments tracked
          </div>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <MetricCard
              key={card.label}
              label={card.label}
              value={card.value}
              accent={card.accent}
            />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartSection title="Performance Trend" description="Attempt vs Percentage">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" stroke="#0f5ec6" strokeWidth={3} name="Percentage" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          <ChartSection title="Exam Attempts" description="JEE, NEET, CUET, MAT comparison">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={examAttemptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="attempts" radius={[10, 10, 0, 0]} fill="#103f7c" name="Attempts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          <ChartSection title="Best vs Average Performance" description="Comparison by exam">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="best" fill="#16a34a" name="Best Percentage" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="average" fill="#0f5ec6" name="Average Percentage" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>

          <ChartSection title="Practice Time Distribution" description="Exam-wise learning time">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={practiceDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {practiceDistributionData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDuration(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>
        </div>

        <div className="mt-6">
          <ChartSection title="Overall Performance" description="Progression across all attempts">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overallPerformanceData}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0f5ec6" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#0f5ec6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe7f5" />
                  <XAxis dataKey="attempt" stroke="#475569" />
                  <YAxis stroke="#475569" domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="percentage" stroke="#0f5ec6" strokeWidth={3} fill="url(#performanceGradient)" name="Performance" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>
        </div>

        <section className="mt-10 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Exam-wise</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Exam Analytics</h2>
            </div>
          </div>

          <div className="grid gap-6">
            {examCards.map((exam) => (
              <ExamAnalyticsCard
                key={exam.examType}
                exam={exam}
                onPredict={(selected) => setSelectedExam(selected)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <RankPredictionModal
        open={Boolean(selectedExam)}
        exam={selectedExam}
        onClose={() => setSelectedExam(null)}
      />
    </div>
  );
}

export default AnalyticsDashboard;
