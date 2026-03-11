/** Reusable Button — variants: primary, secondary, danger, ghost, success. */

const VARIANTS = {
  primary:   "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30",
  secondary: "bg-white/[0.06] hover:bg-white/[0.10] text-slate-200 border border-white/[0.08]",
  danger:    "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
  ghost:     "text-slate-400 hover:text-white hover:bg-white/[0.06]",
  success:   "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20",
};

const SIZES = {
  sm:  "px-3 py-1.5 text-xs rounded-lg",
  md:  "px-4 py-2.5 text-sm rounded-xl",
  lg:  "px-6 py-3 text-sm rounded-xl",
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
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.97]
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
