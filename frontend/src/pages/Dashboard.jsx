/** Main dashboard page — sidebar + task area. */
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import TeamList from "../components/teams/TeamList";
import TaskList from "../components/tasks/TaskList";
import TaskModal from "../components/tasks/TaskModal";
import { useTeams } from "../hooks/useTeams";
import Button from "../components/common/Button";

export default function Dashboard() {
  const { teams } = useTeams();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [taskKey, setTaskKey]           = useState(0); // increments to force TaskList refresh

  const openCreate = () => { setEditingTask(null); setShowModal(true); };
  const openEdit   = (task) => { setEditingTask(task); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingTask(null); };
  const onSaved    = () => { closeModal(); setTaskKey((k) => k + 1); };

  const selectedTeamName = teams.find((t) => t.id === selectedTeam)?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white">
      <Navbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 bg-slate-900/50 border-r border-white/10 hidden md:block">
          <TeamList selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Tasks</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  {selectedTeamName ? `Showing tasks for ${selectedTeamName}` : "Showing all tasks"}
                </p>
              </div>
              <Button id="create-task-btn" onClick={openCreate}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </Button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="search-tasks"
                  type="text"
                  placeholder="Search tasks…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Mobile team selector */}
              <select
                id="filter-team"
                value={selectedTeam || ""}
                onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
                className="md:hidden px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="" className="bg-slate-900">All Teams</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900">{t.name}</option>
                ))}
              </select>

              {/* Assignee filter */}
              <input
                id="filter-assignee"
                type="number"
                placeholder="Assignee ID…"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-36 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Task list */}
            <TaskList
              key={taskKey}
              teamId={selectedTeam}
              assigneeId={assigneeFilter || undefined}
              searchQuery={searchQuery}
              onEdit={openEdit}
              teams={teams}
            />
          </div>
        </main>
      </div>

      {/* Task create/edit modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          teams={teams}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
