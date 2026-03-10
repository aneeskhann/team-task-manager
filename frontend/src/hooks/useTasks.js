/**
 * useTasks — manages task list state with team and assignee filtering.
 *
 * Returns: { tasks, loading, error, refresh, updateTask, deleteTask }
 */
import { useCallback, useEffect, useState } from "react";
import {
  deleteTask as apiDelete,
  getTasks,
  updateTask as apiUpdate,
} from "../api/tasks";

export function useTasks({ teamId, assigneeId } = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (teamId) params.team = teamId;
      if (assigneeId) params.assignee = assigneeId;
      const { data } = await getTasks(params);
      setTasks(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [teamId, assigneeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTask = useCallback(async (id, payload) => {
    const { data } = await apiUpdate(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    return data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await apiDelete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, refresh, updateTask, deleteTask };
}
