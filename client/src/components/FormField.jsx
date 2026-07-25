function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  disabled = false,
  options = [],
  className = "",
  inputClassName = "",
  fullWidth = false,
}) {
  const baseInputClassName = `w-full rounded-lg border p-3 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
    error ? "border-red-400" : "border-gray-300"
  } ${disabled ? "bg-gray-100" : "bg-white"} ${inputClassName}`;

  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`.trim()}>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={baseInputClassName}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClassName} min-h-30 resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClassName}
        />
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default FormField;
