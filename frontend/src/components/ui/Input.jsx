function Input({
  label,
  id,
  name,
  type = "text",
  error,
  helperText,
  className = "",
  required = false,
  ...props
}) {
  const inputId = id || name;

  const describedBy = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          className="mb-2 block text-sm font-bold text-slate-800"
          htmlFor={inputId}
        >
          {label}
          {required && <span className="text-orange-500"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900",
          "outline-none transition placeholder:text-slate-400 focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-emerald-800 focus:ring-emerald-100",
        ].join(" ")}
        {...props}
      />

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
