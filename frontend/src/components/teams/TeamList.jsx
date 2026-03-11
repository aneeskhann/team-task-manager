/** Team list sidebar with inline create form and manage-members button. */
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
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Teams</h2>
        <button
          id="create-team-btn"
          onClick={() => setShowForm((s) => !s)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-200 cursor-pointer"
          title="New team"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="p-3 border-b border-white/[0.06]">
          <input
            id="team-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Team name…"
            className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
            autoFocus
          />
          <Button id="team-submit-btn" type="submit" size="sm" loading={creating} className="mt-2 w-full">
            Create Team
          </Button>
        </form>
      )}

      {/* Team list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {loading ? (
          <div className="space-y-2 px-2 pt-2">
            {[1,2,3].map(i => <div key={i} className="skeleton h-10 w-full" />)}
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No teams yet</p>
            <p className="text-slate-600 text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            <TeamRow label="All Teams" active={selectedTeam === null} onClick={() => onSelectTeam(null)} icon="🏠" />
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

function TeamRow({ label, badge, active, onClick, onManage, icon }) {
  return (
    <div className={`group flex items-center rounded-xl transition-all duration-200 ${
      active
        ? "bg-indigo-500/10 border border-indigo-500/20"
        : "hover:bg-white/[0.04] border border-transparent"
    }`}>
      <button
        onClick={onClick}
        className="flex-1 text-left px-3 py-2.5 cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          {icon ? (
            <span className="text-sm">{icon}</span>
          ) : (
            <span className={`w-2 h-2 rounded-full transition-colors ${active ? "bg-indigo-400" : "bg-slate-600 group-hover:bg-slate-500"}`} />
          )}
          <span className={`text-sm font-medium truncate transition-colors ${active ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-200"}`}>
            {label}
          </span>
          {badge !== undefined && (
            <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-md ${active ? "bg-indigo-500/20 text-indigo-300" : "bg-white/[0.04] text-slate-500"}`}>
              {badge}
            </span>
          )}
        </span>
      </button>
      {onManage && (
        <button
          onClick={onManage}
          className="opacity-0 group-hover:opacity-100 p-2 mr-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all duration-200 cursor-pointer"
          title="Manage members"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}
