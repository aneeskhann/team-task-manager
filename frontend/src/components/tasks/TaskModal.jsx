/** Create / edit task modal with due_date and improved styling. */
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../../api/tasks";
import { getTeam } from "../../api/teams";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const EMPTY_FORM = { title: "", description: "", team: "", assigned_to: "", status: "pending", due_date: "" };

export default function TaskModal({ task, teams, onClose, onSaved }) {
  const isEdit = !!task;
  const [form, setForm] = useState(EMPTY_FORM);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) setForm({
      title: task.title || "", description: task.description || "",
      team: task.team || "", assigned_to: task.assigned_to || "",
      status: task.status || "pending", due_date: task.due_date || "",
    });
  }, [task]);

  useEffect(() => {
    if (!form.team) { setMembers([]); return; }
    getTeam(form.team).then(({ data }) => setMembers(data.members || []));
  }, [form.team]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const payload = {
      title: form.title, description: form.description,
      team: parseInt(form.team, 10), status: form.status,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to ? parseInt(form.assigned_to, 10) : null,
    };
    try {
      isEdit ? await updateTask(task.id, payload) : await createTask(payload);
      onSaved();
    } catch (err) {
      const d = err.response?.data;
      setError(d && typeof d === "object" ? Object.values(d).flat().join(" ") : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-white/[0.12] transition-all duration-200";

  return (
    <Modal title={isEdit ? "Edit Task" : "New Task"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            {error}
          </div>
        )}

        <Input id="task-title" name="title" label="Title" value={form.title} onChange={handleChange} placeholder="What needs to be done?" required />

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
          <textarea
            id="task-description" name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:border-white/[0.12] transition-all duration-200 resize-none"
            placeholder="Add more details (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Team</label>
            <select id="task-team" name="team" value={form.team} onChange={handleChange} required className={selectClass}>
              <option value="">Select team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
            <select id="task-status" name="status" value={form.status} onChange={handleChange} className={selectClass}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Assign to</label>
            <select id="task-assignee" name="assigned_to" value={form.assigned_to} onChange={handleChange} disabled={!form.team} className={`${selectClass} disabled:opacity-40`}>
              <option value="">Unassigned</option>
              {members.map((id) => <option key={id} value={id}>User #{id}</option>)}
            </select>
          </div>
          <Input id="task-due-date" name="due_date" label="Due date" type="date" value={form.due_date} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button id="task-submit" type="submit" loading={loading}>
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
