import { api } from "@/lib/api";

export const portfolioService = {
  myItems: () => api.get("/api/portfolio/me", { auth: true }),
  userItems: (userId) => api.get(`/api/portfolio/user/${userId}`),
  create: (data) => api.post("/api/portfolio", data, { auth: true }),
  update: (itemId, data) => api.put(`/api/portfolio/${itemId}`, data, { auth: true }),
  remove: (itemId) => api.delete(`/api/portfolio/${itemId}`, { auth: true }),
};
