import { useEffect, useState } from "react";
import api from "../api";

const STATUS_COLORS = {
  pending: "bg-amber-500/20 text-amber-300",
  completed: "bg-emerald-500/20 text-emerald-300",
};

export default function TaskList({ selectedTeam, assigneeFilter, searchQuery, onEdit, teams }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (selectedTeam) params.team = selectedTeam;
      if (assigneeFilter) params.assignee = assigneeFilter;
      const { data } = await api.get("/tasks", { params });
      setTasks(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedTeam, assigneeFilter]);

  const filtered = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.assigned_to_username?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      /* silent */
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const { data } = await api.put(`/tasks/${task.id}`, {
        ...task,
        status: newStatus,
      });
      setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } catch {
      /* silent */
    }
  };

  const getTeamName = (teamId) => {
    const team = teams?.find((t) => t.id === teamId);
    return team?.name || `Team ${teamId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <p className="text-slate-400">No tasks found</p>
        <p className="text-slate-500 text-sm mt-1">Create a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((task) => (
        <div
          key={task.id}
          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                    task.status === "completed"
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-500 hover:border-indigo-400"
                  }`}
                >
                  {task.status === "completed" && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                  )}
                </button>
                <h3 className={`font-medium ${task.status === "completed" ? "line-through text-slate-500" : "text-white"}`}>
                  {task.title}
                </h3>
              </div>
              {task.description && (
                <p className="text-sm text-slate-400 ml-7 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 ml-7">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[task.status]}`}>
                  {task.status}
                </span>
                <span className="text-xs text-slate-500">
                  {task.team_name || getTeamName(task.team)}
                </span>
                {task.assigned_to_username && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    {task.assigned_to_username}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
