import { useEffect, useState } from "react";
import api from "../api";

export default function TeamList({ selectedTeam, onSelectTeam, onTeamsLoaded }) {
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const { data } = await api.get("/teams");
      setTeams(data);
      if (onTeamsLoaded) onTeamsLoaded(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const { data } = await api.post("/teams", { name });
      setTeams((prev) => [...prev, data]);
      if (onTeamsLoaded) onTeamsLoaded([...teams, data]);
      onSelectTeam(data.id);
      setName("");
      setShowForm(false);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Teams</h2>
        <button
          id="create-team-btn"
          onClick={() => setShowForm(!showForm)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-3 border-b border-white/10">
          <input
            id="team-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team name…"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            id="team-submit-btn"
            type="submit"
            className="mt-2 w-full py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition cursor-pointer"
          >
            Create
          </button>
        </form>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <p className="px-4 text-sm text-slate-500">Loading…</p>
        ) : teams.length === 0 ? (
          <p className="px-4 text-sm text-slate-500">No teams yet</p>
        ) : (
          <div className="space-y-0.5 px-2">
            <button
              onClick={() => onSelectTeam(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                selectedTeam === null
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              All Teams
            </button>
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTeam(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  selectedTeam === t.id
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400/60" />
                  {t.name}
                  <span className="ml-auto text-xs text-slate-500">{t.member_count}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
