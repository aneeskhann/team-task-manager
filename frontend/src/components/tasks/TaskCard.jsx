/** Task card — premium card layout with status badge, due date, assignee, and hover actions. */

const STATUS_CONFIG = {
  pending:   { label: "Pending",   dot: "bg-amber-400",   bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/20" },
  completed: { label: "Completed", dot: "bg-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/20" },
};

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const done = task.status === "completed";
  const cfg  = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : null;

  const isOverdue = task.due_date && !done && new Date(task.due_date) < new Date();

  return (
    <div className={`group relative bg-white/[0.03] border rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 ${
      done ? "border-white/[0.04]" : "border-white/[0.08]"
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Checkbox */}
            <button
              onClick={() => onToggleStatus(task)}
              className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                done
                  ? "bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30"
                  : "border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10"
              }`}
            >
              {done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Title */}
            <h3 className={`font-semibold truncate transition-colors ${
              done ? "line-through text-slate-600" : "text-white"
            }`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-sm text-slate-500 ml-8 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
          )}

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-2 ml-8">
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>

            {/* Team */}
            {task.team_name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {task.team_name}
              </span>
            )}

            {/* Assignee */}
            {task.assigned_to_username && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-400 bg-white/[0.04] border border-white/[0.06]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {task.assigned_to_username}
              </span>
            )}

            {/* Due date */}
            {task.due_date && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border ${
                isOverdue
                  ? "text-red-400 bg-red-500/8 border-red-500/20"
                  : "text-slate-400 bg-white/[0.04] border-white/[0.06]"
              }`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {isOverdue && <span className="font-semibold">Overdue ·</span>} {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => onEdit(task)} className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all cursor-pointer" title="Edit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer" title="Delete">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
