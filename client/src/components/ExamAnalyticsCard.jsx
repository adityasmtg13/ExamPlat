import { FaArrowRight, FaClock, FaChartLine, FaTrophy } from "react-icons/fa";

const formatDuration = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes} min`;
};

function ExamAnalyticsCard({ exam, onPredict }) {
  const totalPracticeTime = exam.attempts.reduce((sum, item) => sum + (item.timeTaken || 0), 0);

  const highestMarks = Math.max(...exam.attempts.map((item) => item.score || 0), 0);
  const lowestMarks = exam.attempts.length
    ? Math.min(...exam.attempts.map((item) => item.score || 0))
    : 0;
  const averageMarks = exam.attempts.length
    ? Number(
        (
          exam.attempts.reduce((sum, item) => sum + (item.score || 0), 0) /
          exam.attempts.length
        ).toFixed(2)
      )
    : 0;

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Exam
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{exam.examType}</h3>
        </div>

        <button
          type="button"
          onClick={() => onPredict(exam)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#103f7c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0e3265]"
        >
          Predict Rank
          <FaArrowRight className="text-xs" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Attempts</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{exam.totalAttempts}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Highest Marks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{highestMarks}</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Lowest Marks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{lowestMarks}</p>
        </div>

        <div className="rounded-2xl bg-violet-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Average Marks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{averageMarks}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <FaTrophy className="text-xs" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Highest %</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{exam.bestPercentage ?? 0}%</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <FaChartLine className="text-xs" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Lowest %</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {Math.min(...exam.attempts.map((item) => item.percentage || 0), 0)}%
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <FaChartLine className="text-xs" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Average %</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{exam.averagePercentage ?? 0}%</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <FaClock className="text-xs" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Practice Time</span>
          </div>
          <p className="mt-2 text-lg font-bold text-slate-900">{formatDuration(totalPracticeTime)}</p>
        </div>
      </div>
    </article>
  );
}

export default ExamAnalyticsCard;
