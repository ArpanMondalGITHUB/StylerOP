import axios from "axios";

const AXIOS_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: AXIOS_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept if no response or not 401
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // ✅ CRITICAL: Skip refresh requests to prevent infinite loop
    if (originalRequest.url?.includes('/refresh')) {
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Queue subsequent requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ FIXED: Correct endpoint URL
      await axiosInstance.post("/auth/v1/refresh", {}, { withCredentials: true });
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err);
      // Optionally redirect to login
      // window.location.href = '/auth';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;