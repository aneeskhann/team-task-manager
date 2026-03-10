/** App-wide navigation bar. */
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
      </div>

      {/* User area */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-sm font-semibold text-indigo-300">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">{user.username}</span>
          </div>
          <button
            id="logout-btn"
            onClick={logout}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
