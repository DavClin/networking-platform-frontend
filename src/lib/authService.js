import { api, setTokens, clearTokens, setStoredUser, getStoredUser } from "@/lib/api";

export const authService = {
  async signup({ email, username, password, role }) {
    const data = await api.post("/api/auth/signup", { email, username, password, role });
    setTokens(data.access_token, data.refresh_token);
    setStoredUser(data.user);
    return data.user;
  },

  async login({ email, password }) {
    const data = await api.post("/api/auth/login", { email, password });
    setTokens(data.access_token, data.refresh_token);
    setStoredUser(data.user);
    return data.user;
  },

  logout() {
    clearTokens();
  },

  getStoredUser,
};
