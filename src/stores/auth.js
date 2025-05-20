import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// Simulation de données utilisateurs pour le développement
const mockUsers = ref([
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@test.com',
    password: 'password123',
    phone: '0612345678',
    address: '123 rue de Paris, 75001 Paris',
    isDriver: true,
    driverFirstName: '',
    driverLastName: '',
    driverPhone: ''
  }
])

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const authError = ref(null)
  
  // Actions
  const login = async (email, password) => {
    try {
      authError.value = null
      
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const foundUser = mockUsers.value.find(u => u.email === email)
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Identifiants incorrects')
      }
      
      // Copie de l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Stockage du user dans le state et localStorage
      user.value = userWithoutPassword
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return userWithoutPassword
    } catch (error) {
      authError.value = error.message
      throw error
    }
  }
  
  const register = async (userData, password) => {
    try {
      authError.value = null
      
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vérifier si l'email existe déjà
      const existingUser = mockUsers.value.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }
      
      // Créer un nouvel utilisateur
      const newUser = {
        id: uuidv4(),
        ...userData,
        password
      }
      
      // Ajouter l'utilisateur à la liste des utilisateurs mock
      mockUsers.value.push(newUser)
      
      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = newUser
      
      // Stockage du user dans le state et localStorage
      user.value = userWithoutPassword
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return userWithoutPassword
    } catch (error) {
      authError.value = error.message
      throw error
    }
  }
  
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }
  
  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }
  
  // Initialisation - vérifier si l'utilisateur est déjà connecté
  checkAuth()
  
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