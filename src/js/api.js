import axios from 'axios';

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // À remplacer par l'URL de l'API
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
});

const apiRegister = axios.create({
  baseURL: 'http://localhost:8000/api', // À remplacer par l'URL de l'API
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Intercepteur pour ajouter le token JWT aux requêtes
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

// Services d'authentification
export const authService = {
  register: (userData) => apiRegister.post('/register', userData),
  login: (credentials) => apiRegister.post('/login_check', credentials),
};

// Services pour les véhicules
export const vehicleService = {
  getAll: () => api.get('/vehicules/'),
  getById: (id) => api.get(`/vehicules/${id}`),
  create: (vehicleData) => api.post('/vehicules', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicules/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicules/${id}`)
};

// Services pour les rendez-vous
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

// Services pour les garages
export const garageService = {
  getAll: () => api.get('/garages/'),
  getById: (id) => api.get(`/garages/${id}`)
};

// Services pour les opérations
export const operationService = {
  getAll: () => api.get('/operations/'),
  getById: (id) => api.get(`/operations/${id}`),
  getCategories: () => api.get('/operations/category')
};

// Services pour les catégories d'opérations
export const categoryService = {
  getAll: () => api.get('/operations/category/'),
  getById: (id) => api.get(`/operations/categories/${id}`)
};

// Services pour les utilisateurs (à implémenter dans le backend si nécessaire)
export const userService = {
  // Cette fonction pourra être utilisée lorsqu'un endpoint API sera disponible
  getProfile: () => api.get('/user/me')
};

export default api; 