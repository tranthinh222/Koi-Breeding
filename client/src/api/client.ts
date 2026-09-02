import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8090/koi_breeding",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ??
      sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401 + refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const requestUrl = originalRequest.url || "";

    // ✓ SKIP retry cho auth endpoints
    const shouldNotRefresh =
      requestUrl.includes("/auth/me") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/verify-reset-code") ||
      requestUrl.includes("/auth/reset-password");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldNotRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        clearAuthStorage();
        // ✓ Không redirect, để app xử lý
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const clearAuthStorage = (): void => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("access");
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearAuthStorage();
  }
};
