function ChartSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition duration-200 hover:shadow-md sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Insights
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{title}</h3>
        </div>
        {description ? (
          <p className="max-w-xs text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default ChartSection;
