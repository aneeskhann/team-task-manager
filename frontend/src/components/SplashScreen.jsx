/** Splash screen — animated loading screen shown before login. */
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinished }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 2200);
    const exit  = setTimeout(() => onFinished(), 2700);
    return () => { clearTimeout(timer); clearTimeout(exit); };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0b0f1a] ${exiting ? "splash-exit" : "splash-enter"}`}>
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo */}
        <div className="relative">
          {/* Orbiting ring */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "splash-orbit 3s linear infinite" }}>
            <div className="w-28 h-28 rounded-full border border-indigo-500/30 border-t-indigo-400" />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20" style={{ animation: "splash-pulse-ring 2s ease-out infinite" }} />
          </div>
          {/* Icon */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            TaskFlow
          </h1>
          <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">Team Task Manager</p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            style={{ animation: "splash-fade-in 2s ease-out forwards", transformOrigin: "left", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
