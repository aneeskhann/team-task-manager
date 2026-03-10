/** Create / edit task modal. Uses common Modal, Input, Button components. */
import { useEffect, useState } from "react";
import { createTask, updateTask } from "../../api/tasks";
import { getTeam } from "../../api/teams";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const EMPTY_FORM = {
  title: "",
  description: "",
  team: "",
  assigned_to: "",
  status: "pending",
  due_date: "",
};

export default function TaskModal({ task, teams, onClose, onSaved }) {
  const isEdit = !!task;
  const [form, setForm] = useState(EMPTY_FORM);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Populate form when editing an existing task */
  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || "",
        description: task.description || "",
        team:        task.team        || "",
        assigned_to: task.assigned_to || "",
        status:      task.status      || "pending",
        due_date:    task.due_date    || "",
      });
    }
  }, [task]);

  /* Fetch members when selected team changes */
  useEffect(() => {
    if (!form.team) { setMembers([]); return; }
    getTeam(form.team).then(({ data }) => setMembers(data.members || []));
  }, [form.team]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title:       form.title,
      description: form.description,
      team:        parseInt(form.team, 10),
      status:      form.status,
      due_date:    form.due_date || null,
      assigned_to: form.assigned_to ? parseInt(form.assigned_to, 10) : null,
    };

    try {
      if (isEdit) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onSaved();
    } catch (err) {
      const d = err.response?.data;
      if (d && typeof d === "object") {
        setError(Object.values(d).flat().join(" "));
      } else {
        setError("Something went wrong — please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Task" : "Create Task"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <Input
          id="task-title"
          name="title"
          label="Title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />

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
                <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
              ))}
            </select>
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
              <option value="pending"   className="bg-slate-900">Pending</option>
              <option value="completed" className="bg-slate-900">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Assign to</label>
            <select
              id="task-assignee"
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              disabled={!form.team}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
            >
              <option value="" className="bg-slate-900">Unassigned</option>
              {members.map((id) => (
                <option key={id} value={id} className="bg-slate-900">
                  User #{id}
                </option>
              ))}
            </select>
          </div>

          <Input
            id="task-due-date"
            name="due_date"
            label="Due date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button id="task-submit" type="submit" loading={loading}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
