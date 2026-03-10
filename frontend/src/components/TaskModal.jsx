import { useEffect, useState } from "react";
import api from "../api";

export default function TaskModal({ task, teams, onClose, onSaved }) {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: "",
    description: "",
    team: "",
    assigned_to: "",
    status: "pending",
  });
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        team: task.team || "",
        assigned_to: task.assigned_to || "",
        status: task.status || "pending",
      });
    }
  }, [task]);

  // Fetch team members when team changes
  useEffect(() => {
    if (!form.team) {
      setMembers([]);
      return;
    }
    const fetchMembers = async () => {
      try {
        const { data } = await api.get(`/teams/${form.team}`);
        // Fetch user details for each member
        const memberDetails = [];
        for (const memberId of data.members) {
          memberDetails.push({ id: memberId });
        }
        setMembers(memberDetails);
      } catch {
        setMembers([]);
      }
    };
    fetchMembers();
  }, [form.team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      team: parseInt(form.team, 10),
      status: form.status,
    };
    if (form.assigned_to) payload.assigned_to = parseInt(form.assigned_to, 10);
    else payload.assigned_to = null;

    try {
      if (isEdit) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      onSaved();
    } catch (err) {
      const d = err.response?.data;
      if (typeof d === "object") {
        const msgs = Object.values(d).flat();
        setError(msgs.join(" "));
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Team</label>
              <select
                id="task-team"
                name="team"
                value={form.team}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="" className="bg-slate-900">Select team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign to</label>
              <select
                id="task-assignee"
                name="assigned_to"
                value={form.assigned_to}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="" className="bg-slate-900">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    User #{m.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <select
              id="task-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="completed" className="bg-slate-900">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="task-submit"
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg transition shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
