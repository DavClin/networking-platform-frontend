import { api } from "@/lib/api";

export const connectionService = {
  list: (statusFilter) => api.get("/api/connections", { auth: true, params: { status_filter: statusFilter } }),
  send: (receiverId) => api.post("/api/connections", { receiver_id: receiverId }, { auth: true }),
  respond: (connectionId, status) =>
    api.put(`/api/connections/${connectionId}`, { status }, { auth: true }),
  remove: (connectionId) => api.delete(`/api/connections/${connectionId}`, { auth: true }),
};
