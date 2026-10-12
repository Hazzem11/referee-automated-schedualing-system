import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "",
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

// Session expired (or never logged in): send the user to the login page,
// except for auth endpoints themselves and while on public pages.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const onPublicPage =
      window.location.pathname === "/login" ||
      window.location.pathname.startsWith("/accept-invite");
    if (status === 401 && !url.includes("/api/auth/") && !onPublicPage) {
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
