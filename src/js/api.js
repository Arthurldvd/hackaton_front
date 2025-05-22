import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
});

const apiRegister = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const authService = {
  register: (userData) => apiRegister.post('/register', userData),
  login: (credentials) => apiRegister.post('/login_check', credentials),
};

export const vehicleService = {
  getAll: () => api.get('/vehicules/'),
  getById: (id) => api.get(`/vehicules/${id}`),
  create: (vehicleData) => api.post('/vehicules', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicules/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicules/${id}`),
  getOperations: (id) => api.get(`/vehicules/${id}/operations`),
  getOperationsAlt1: (id) => api.get(`/vehicles/${id}/operations`),
  getOperationsAlt2: (id) => api.get(`/operations/vehicle/${id}`)
};

export const appointmentService = {
  getAll: () => api.get('/appointments/user'),
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getAvailabilities: (garageId, date) => api.get(`/appointments/avaibilities`, {
    params: { garage_id: garageId, date: date }
  }),
  getAppointmentsByUser: () => api.get('/appointments/user'),
  getPdf: (appointmentId) => api.get(`/appointments/${appointmentId}/pdf`, {
    responseType: 'blob'
  }),
};

export const garageService = {
  getAll: () => api.get('/garages/'),
  getById: (id) => api.get(`/garages/${id}`)
};

export const operationService = {
  getAll: () => api.get('/operations/'),
  getById: (id) => api.get(`/operations/${id}`),
  getCategories: () => api.get('/operations/category')
};

export const categoryService = {
  getAll: () => api.get('/operations/category/'),
  getById: (id) => api.get(`/operations/categories/${id}`)
};

export const userService = {
  getProfile: () => api.get('/user/me')
};

export default api; 