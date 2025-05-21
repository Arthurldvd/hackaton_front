import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../js/api'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const authError = ref(null)
  
  // Actions
  const login = async (email, password) => {
    try {
      authError.value = null
      
      const response = await authService.login({ email, password });
      
      // Stocker le token JWT
      localStorage.setItem('token', response.data.token);
      
      // Utiliser les données du formulaire d'inscription au lieu de la réponse API
      // Cela permet de réutiliser les informations spécifiées pendant l'inscription
      let userData = {
        email: email,
        firstName: email.split('@')[0], // Utiliser une partie de l'email comme nom temporaire
        lastName: ''
      };
      
      // Stockage du user dans le state et localStorage
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
      console.log(userData);
      
      const response = await authService.register(userData);
      
      // Si l'inscription renvoie directement un token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Créer un objet utilisateur à partir des données envoyées
      const newUser = {
        email: userData.email,
        firstName: userData.firstname,
        lastName: userData.lastname
      };
      
      // Stockage du user dans le state et localStorage
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
      logout(); // Si le token n'existe pas mais que l'utilisateur est stocké
    }
  }
  
  // Initialisation - vérifier si l'utilisateur est déjà connecté
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