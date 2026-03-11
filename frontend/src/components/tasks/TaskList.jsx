/** Task list — renders TaskCard rows with skeleton loading and empty state. */
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TaskList({ teamId, assigneeId, searchQuery, onEdit }) {
  const { tasks, loading, updateTask, deleteTask } = useTasks({ teamId, assigneeId });

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
    await updateTask(task.id, { ...task, status: newStatus });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] mb-5">
          <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-slate-300 font-semibold text-lg">No tasks found</p>
        <p className="text-slate-500 text-sm mt-1.5">Create a task to get started with your team</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 page-enter">
      {filtered.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={handleToggleStatus}
          onEdit={onEdit}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}
