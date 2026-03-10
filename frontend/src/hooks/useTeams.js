/**
 * useTeams — manages team list state.
 *
 * Returns: { teams, loading, error, refresh, createTeam }
 */
import { useCallback, useEffect, useState } from "react";
import { createTeam as apiCreate, getTeams } from "../api/teams";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getTeams();
      setTeams(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load teams.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTeam = useCallback(async (name) => {
    const { data } = await apiCreate({ name });
    setTeams((prev) => [...prev, data]);
    return data;
  }, []);

  return { teams, loading, error, refresh, createTeam };
}
