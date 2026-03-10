/** Reusable text input with label and error state. */

export default function Input({
  label,
  id,
  error,
  className = "",
  accentColor = "indigo",
  ...props
}) {
  const ring = accentColor === "emerald" ? "focus:ring-emerald-500" : "focus:ring-indigo-500";

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
          text-white placeholder-slate-500 focus:outline-none focus:ring-2
          focus:border-transparent transition ${ring} ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
