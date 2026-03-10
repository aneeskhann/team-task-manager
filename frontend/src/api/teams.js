/** Teams API service. */
import api from "./index";

export const getTeams      = ()               => api.get("/teams");
export const getTeam       = (id)             => api.get(`/teams/${id}`);
export const createTeam    = (data)           => api.post("/teams", data);
export const updateTeam    = (id, data)       => api.put(`/teams/${id}`, data);
export const deleteTeam    = (id)             => api.delete(`/teams/${id}`);
export const addMember     = (id, userId)     => api.post(`/teams/${id}/add-member`, { user_id: userId });
export const removeMember  = (id, userId)     => api.post(`/teams/${id}/remove-member`, { user_id: userId });
export const inviteMember  = (id, email)      => api.post(`/teams/${id}/invite`, { email });
