import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every authenticated request
api.interceptors.request.use(
  (config) => {
    // Read token from sessionStorage with fallback to localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global response errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints (Strictly POST, GET)
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Users API endpoints (Strictly GET, PATCH)
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.patch('/users/me', userData),
  changePassword: (passwordData) => api.patch('/users/me/password', passwordData),
  getAllUsers: () => api.get('/users'), // Admin only
};

// Jobs API endpoints (Strictly GET, POST, PATCH, DELETE)
export const jobAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.patch(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Applications API endpoints (Strictly GET, POST, PATCH, DELETE)
export const applicationAPI = {
  getMyApplications: () => api.get('/applications/my'),
  getApplications: () => api.get('/applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/applications', data, config);
  },
  updateApplicationStatus: (id, statusData) => api.patch(`/applications/${id}`, statusData),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Notification API endpoints (Strictly GET, PATCH, DELETE)
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Contact API endpoints (Strictly POST, GET, DELETE)
export const contactAPI = {
  submit: (contactData) => api.post('/contact', contactData),
  getMessages: () => api.get('/contact'), // Admin only
  deleteMessage: (id) => api.delete(`/contact/${id}`), // Admin only
};

export default api;
