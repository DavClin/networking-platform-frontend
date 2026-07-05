import { api } from "@/lib/api";

export const jobService = {
  search: (filters) => api.get("/api/jobs", { params: filters }),
  recommended: (limit) => api.get("/api/jobs/recommended", { auth: true, params: { limit } }),
  get: (jobId) => api.get(`/api/jobs/${jobId}`),
  create: (data) => api.post("/api/jobs", data, { auth: true }),
  update: (jobId, data) => api.put(`/api/jobs/${jobId}`, data, { auth: true }),
  apply: (jobId, data) => api.post(`/api/jobs/${jobId}/apply`, data, { auth: true }),
  listApplicationsForJob: (jobId) => api.get(`/api/jobs/${jobId}/applications`, { auth: true }),
  myApplications: () => api.get("/api/jobs/applications/me", { auth: true }),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/api/jobs/applications/${applicationId}`, { status }, { auth: true }),
};
