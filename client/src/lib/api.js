import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  verifyPin: (pin) => api.post("/auth/verify-pin", { pin }),
};

// ── Payments ──
export const paymentAPI = {
  send: (data) => api.post("/payments/send", data),
  checkBalance: (pin) => api.post("/payments/check-balance", { pin }),
  sendOffline: (message) => api.post("/payments/send-offline", { message }),
};

// ── Budget ──
export const budgetAPI = {
  get: () => api.get("/budget"),
  update: (budget) => api.post("/budget/update", { budget }),
  addExpense: (data) => api.post("/budget/expense", data),
  getExpenses: () => api.get("/budget/expenses"),
  editExpense: (id, data) => api.put(`/budget/expense/${id}`, data),
  deleteExpense: (id) => api.delete(`/budget/expense/${id}`),
};

// ── Notes ──
export const notesAPI = {
  getAll: () => api.get("/notes"),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

export default api;
