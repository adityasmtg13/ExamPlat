function PredictionStatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/60">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PredictionCollegeCard({ title, index }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-full min-h-[170px] flex-col justify-between rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-700">
            #{index}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-base font-bold text-slate-900">{title}</p>
          <p className="text-sm font-medium text-slate-500">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

function RankPredictionModal({ exam, open, onClose }) {
  if (!open || !exam) {
    return null;
  }

  const stats = [
    { label: "Exam Name", value: exam.examType || "N/A" },
    { label: "Total Attempts", value: exam.totalAttempts ?? 0 },
    { label: "Highest Marks", value: exam.highestMarks ?? "--" },
    { label: "Lowest Marks", value: exam.lowestMarks ?? "--" },
    { label: "Average Marks", value: exam.averageMarks ?? "--" },
    { label: "Highest Percentage", value: exam.highestPercentage == null ? "--" : `${exam.highestPercentage}%` },
    { label: "Lowest Percentage", value: exam.lowestPercentage == null ? "--" : `${exam.lowestPercentage}%` },
    { label: "Average Percentage", value: exam.averagePercentage == null ? "--" : `${exam.averagePercentage}%` },
  ];

  const predictedColleges = [
    "College Prediction #1",
    "College Prediction #2",
    "College Prediction #3",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#103f7c] to-[#0d3a70] px-6 py-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Prediction Preview
            </p>
            <h3 className="mt-1 text-2xl font-bold">{exam.examType || "Exam"}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Close
          </button>
        </div>

        <div className="space-y-7 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <PredictionStatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Estimated Rank
            </p>
            <p className="mt-3 text-3xl font-bold text-slate-900">Coming Soon</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                Predicted Colleges
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {predictedColleges.map((title, index) => (
                <PredictionCollegeCard key={title} title={title} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankPredictionModal;
