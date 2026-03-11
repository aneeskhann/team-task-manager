/** Reusable text input with label, error state, and icon support. */

export default function Input({
  label,
  id,
  error,
  className = "",
  icon,
  ...props
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full ${icon ? "pl-11" : "px-4"} pr-4 py-3 
            bg-white/[0.04] border border-white/[0.08] rounded-xl
            text-white placeholder-slate-500 
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            hover:border-white/[0.12]
            transition-all duration-200 ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}
