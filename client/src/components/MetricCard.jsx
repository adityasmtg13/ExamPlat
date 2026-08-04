function MetricCard({ label, value, accent = "blue", subtitle = "" }) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${accentClasses[accent] || accentClasses.blue}`}>
        {label}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        {subtitle ? <span className="text-xs text-slate-500">{subtitle}</span> : null}
      </div>
    </div>
  );
}

export default MetricCard;
