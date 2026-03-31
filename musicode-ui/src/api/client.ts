import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true, // Send cookies with every request
});

// --- 401 interceptor with refresh queue ---
//
// WHY A QUEUE: When the access token expires, multiple API calls may fire
// simultaneously (e.g. page load fetches albums + artists + scan status).
// All get 401. Without a queue, each would trigger its own refresh call,
// causing race conditions (old refresh token revoked before others use it).
//
// The queue ensures: first 401 triggers the refresh, subsequent 401s wait
// for that refresh to complete, then all retry with the new token.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept: non-401s, login/refresh endpoints, already-retried requests
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest.url === '/auth/login' ||
      originalRequest.url === '/auth/refresh' ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request to retry after refresh completes
    if (isRefreshing) {
      console.debug('[axios] 401 queued (refresh in progress), queue size:', failedQueue.length + 1);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;
    console.debug('[axios] 401 received, attempting token refresh...');

    try {
      await api.post('/auth/refresh');
      console.debug('[axios] Refresh successful, retrying original + queued requests');
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      console.debug('[axios] Refresh failed, redirecting to login');
      processQueue(refreshError);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
