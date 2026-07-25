function QuickServiceCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  iconClassName = "text-blue-700",
  status = null,
  tooltip = "",
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        title={tooltip}
        className={`group flex h-full min-h-45 flex-col rounded-xl border border-gray-200 bg-white p-6 text-left shadow-md transition duration-200 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:-translate-y-1 hover:shadow-xl"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className={`mb-4 text-4xl ${iconClassName}`}>{icon}</div>
          {status && <span className={`text-lg font-bold ${status === "valid" ? "text-green-600" : "text-red-600"}`}>{status === "valid" ? "✔" : "✖"}</span>}
        </div>
        <h4 className="font-semibold text-xl text-[#103f7c]">{title}</h4>
        <p className="mt-2 text-gray-600">{description}</p>
      </button>
    </div>
  );
}

export default QuickServiceCard;
