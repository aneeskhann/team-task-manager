/** Navbar — sticky top bar with gradient brand, user avatar, and logout. */
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-[#0f1629]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="font-bold text-white text-lg tracking-tight">
          Task<span className="text-indigo-400">Flow</span>
        </span>
      </div>

      {/* User area */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/40 to-blue-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 uppercase">
              {user.username[0]}
            </div>
            <span className="text-sm text-slate-300 font-medium">{user.username}</span>
          </div>
          <button
            id="logout-btn"
            onClick={logout}
            className="px-3.5 py-1.5 text-sm text-slate-400 hover:text-white bg-white/[0.03] hover:bg-red-500/10 hover:text-red-400 border border-white/[0.06] hover:border-red-500/20 rounded-xl transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
