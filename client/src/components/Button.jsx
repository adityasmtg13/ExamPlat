import React from "react";

function Button({
  children,
  type = "button",
  className = "",
  loading = false,
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
