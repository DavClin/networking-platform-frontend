import { api } from "@/lib/api";

export const userService = {
  getMyProfile: () => api.get("/api/users/me/profile", { auth: true }),
  createMyProfile: (data) => api.post("/api/users/me/profile", data, { auth: true }),
  updateMyProfile: (data) => api.put("/api/users/me/profile", data, { auth: true }),
  setMySkills: (skills) => api.put("/api/users/me/skills", skills, { auth: true }),
  getUserProfile: (userId) => api.get(`/api/users/${userId}/profile`),
};

export const skillService = {
  list: (q) => api.get("/api/skills", { params: { q } }),
};
