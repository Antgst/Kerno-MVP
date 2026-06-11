function Select({
  label,
  id,
  name,
  options = [],
  error,
  helperText,
  placeholder = "Select an option",
  className = "",
  required = false,
  ...props
}) {
  const selectId = id || name;

  const describedBy = error
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          className="mb-2 block text-sm font-bold text-slate-800"
          htmlFor={selectId}
        >
          {label}
          {required && <span className="text-orange-500"> *</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900",
          "outline-none transition focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 focus:border-emerald-800 focus:ring-emerald-100",
        ].join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-2 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
