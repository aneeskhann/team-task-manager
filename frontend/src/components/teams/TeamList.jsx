/** Team list sidebar with inline create-team form. */
import { useState } from "react";
import { useTeams } from "../../hooks/useTeams";
import Button from "../common/Button";
import AddMemberModal from "./AddMemberModal";

export default function TeamList({ selectedTeam, onSelectTeam }) {
  const { teams, loading, createTeam, refresh } = useTeams();
  const [newName, setNewName]       = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [creating, setCreating]     = useState(false);
  const [manageTeam, setManageTeam] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const team = await createTeam(newName.trim());
      onSelectTeam(team.id);
      setNewName("");
      setShowForm(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teams</h2>
        <button
          id="create-team-btn"
          onClick={() => setShowForm((s) => !s)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition cursor-pointer"
          title="New team"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Inline create-team form */}
      {showForm && (
        <form onSubmit={handleCreate} className="p-3 border-b border-white/10">
          <input
            id="team-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Team name…"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            autoFocus
          />
          <Button id="team-submit-btn" type="submit" size="sm" loading={creating} className="mt-2 w-full">
            Create
          </Button>
        </form>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <p className="px-4 text-sm text-slate-500">Loading…</p>
        ) : teams.length === 0 ? (
          <p className="px-4 text-sm text-slate-500 mt-2">No teams yet</p>
        ) : (
          <div className="space-y-0.5 px-2">
            {/* "All" option */}
            <TeamRow
              label="All Teams"
              active={selectedTeam === null}
              onClick={() => onSelectTeam(null)}
            />
            {teams.map((team) => (
              <TeamRow
                key={team.id}
                label={team.name}
                badge={team.member_count}
                active={selectedTeam === team.id}
                onClick={() => onSelectTeam(team.id)}
                onManage={() => setManageTeam(team)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add-member / invite modal */}
      {manageTeam && (
        <AddMemberModal
          team={manageTeam}
          onClose={() => setManageTeam(null)}
          onUpdated={() => refresh()}
        />
      )}
    </div>
  );
}

/** Single team row button. */
function TeamRow({ label, badge, active, onClick, onManage }) {
  return (
    <div className={`group flex items-center rounded-lg transition ${active ? "bg-indigo-500/20" : "hover:bg-white/5"}`}>
      <button
        onClick={onClick}
        className={`flex-1 text-left px-3 py-2 text-sm transition cursor-pointer ${active ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-200"}`}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${active ? "bg-indigo-400" : "bg-slate-600"}`} />
          <span className="truncate">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto text-xs text-slate-500">{badge}</span>
          )}
        </span>
      </button>
      {onManage && (
        <button
          onClick={onManage}
          className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 text-slate-500 hover:text-indigo-400 transition cursor-pointer"
          title="Manage members"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
