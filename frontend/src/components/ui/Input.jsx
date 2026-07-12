/**
 * Input Component
 *
 * Props:
 * - label
 * - placeholder
 * - type
 * - value
 * - onChange
 * - error
 * - disabled
 */

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-medium text-gray-900 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full
          rounded-lg
          border
          px-3
          py-2
          text-gray-900
          dark:text-gray-300
          placeholder:text-gray-500
          dark:placeholder:text-gray-400
          outline-none
          transition-all
          ${
            disabled
              ? "bg-gray-100 dark:bg-slate-600 border-gray-300 cursor-not-allowed"
              : "bg-white dark:bg-slate-700"
          }
          ${
            error
              ? "border-red-700 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : !disabled &&
                "border-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          }
        `}
      />

      {error && (
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default Input;
