import { api } from "@/lib/api";

export const messageService = {
  conversations: () => api.get("/api/messages/conversations", { auth: true }),
  thread: (otherUserId) => api.get(`/api/messages/thread/${otherUserId}`, { auth: true }),
  send: (data) => api.post("/api/messages", data, { auth: true }),
  markRead: (messageId) => api.put(`/api/messages/${messageId}/read`, undefined, { auth: true }),
  remove: (messageId) => api.delete(`/api/messages/${messageId}`, { auth: true }),
};
