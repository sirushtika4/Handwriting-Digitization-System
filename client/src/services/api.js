import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authorization = error.config?.headers?.Authorization;
    if (error.response?.status === 401 && authorization) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        const returnTo = window.location.pathname + window.location.search;
        window.location.replace(
          `/login?reason=session-expired&returnTo=${encodeURIComponent(returnTo)}`
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
