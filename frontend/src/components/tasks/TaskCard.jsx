/** Single task card — shows title, status badge, team, assignee, due date. */
import Button from "../common/Button";

const STATUS_STYLES = {
  pending:   "bg-amber-500/20 text-amber-300",
  completed: "bg-emerald-500/20 text-emerald-300",
};

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const done = task.status === "completed";

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;

  const isOverdue = task.due_date && !done && new Date(task.due_date) < new Date();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition group">
      <div className="flex items-start justify-between gap-4">
        {/* Left — checkbox + content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            {/* Status toggle checkbox */}
            <button
              onClick={() => onToggleStatus(task)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition cursor-pointer ${
                done ? "bg-emerald-500 border-emerald-500" : "border-slate-500 hover:border-indigo-400"
              }`}
            >
              {done && <CheckIcon />}
            </button>

            <h3 className={`font-medium truncate ${done ? "line-through text-slate-500" : "text-white"}`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-sm text-slate-400 ml-7.5 line-clamp-2 mb-2">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 ml-7">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_STYLES[task.status]}`}>
              {task.status}
            </span>

            {task.team_name && (
              <span className="text-xs text-slate-500">{task.team_name}</span>
            )}

            {task.assigned_to_username && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {task.assigned_to_username}
              </span>
            )}

            {task.due_date && (
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-400" : "text-slate-500"}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isOverdue ? "Overdue · " : ""}{formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>

        {/* Right — action buttons (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition cursor-pointer"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
