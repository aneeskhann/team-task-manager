/** Reusable Button component with variant and size support. */

const VARIANTS = {
  primary:   "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40",
  secondary: "bg-white/10 hover:bg-white/20 text-white",
  danger:    "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20",
  ghost:     "text-slate-400 hover:text-white hover:bg-white/10",
  success:   "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
};

const SIZES = {
  sm:  "px-3 py-1.5 text-sm",
  md:  "px-4 py-2 text-sm",
  lg:  "px-6 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  icon,
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg
        transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
