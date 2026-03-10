/** Task list — renders TaskCard rows, handles filtering, empty state. */
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";
import { updateTask } from "../../api/tasks";

export default function TaskList({ teamId, assigneeId, searchQuery, onEdit, teams }) {
  const { tasks, loading, updateTask: localUpdate, deleteTask, refresh } = useTasks({ teamId, assigneeId });

  const filtered = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.assigned_to_username?.toLowerCase().includes(q) ||
      t.team_name?.toLowerCase().includes(q)
    );
  });

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    await localUpdate(task.id, { ...task, status: newStatus });
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
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No tasks found</p>
        <p className="text-slate-500 text-sm mt-1">Create a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={handleToggleStatus}
          onEdit={onEdit}
          onDelete={(id) => deleteTask(id)}
        />
      ))}
    </div>
  );
}
