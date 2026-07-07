import { api } from "@/lib/api";

export const notificationService = {
  list: (unreadOnly) => api.get("/api/notifications", { auth: true, params: { unread_only: unreadOnly } }),
  unreadCount: () => api.get("/api/notifications/unread-count", { auth: true }),
  markRead: (id) => api.put(`/api/notifications/${id}/read`, undefined, { auth: true }),
  markAllRead: () => api.put("/api/notifications/read-all", undefined, { auth: true }),
};
