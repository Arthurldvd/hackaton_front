import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../js/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const authError = ref(null)
  
  const login = async (email, password) => {
    try {
      authError.value = null
      
      const response = await authService.login({ email, password });
      
      localStorage.setItem('token', response.data.token);
      
      let userData = {
        email: email,
        firstName: email.split('@')[0],
        lastName: ''
      };
      
      user.value = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      authError.value = error.response?.data?.message || 'Erreur de connexion';
      throw error;
    }
  }
  
  const register = async (userData) => {
    try {
      authError.value = null;
      
      const response = await authService.register(userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      const newUser = {
        email: userData.email,
        firstName: userData.firstname,
        lastName: userData.lastname
      };
      
      user.value = newUser;
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      authError.value = error.response?.data?.message || 'Erreur lors de l\'inscription';
      throw error;
    }
  }
  
  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      user.value = JSON.parse(savedUser);
    } else {
      logout();
    }
  }
  
  checkAuth();
  
  return {
    user,
    isAuthenticated,
    authError,
    login,
    register,
    logout,
    checkAuth
  }
}) 