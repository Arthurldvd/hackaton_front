import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './js/api'

// Configuration de l'URL de base de l'API
api.defaults.baseURL = 'http://localhost:8000/api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser le store au démarrage
import { useGarageStore } from './stores/garage'
import { useAuthStore } from './stores/auth'

// Vérifier l'authentification
const authStore = useAuthStore()
authStore.checkAuth()

// Configuration du routeur pour protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/about']
  const authRequired = !publicPages.includes(to.path)
  const isAuthenticated = authStore.isAuthenticated

  if (authRequired && !isAuthenticated) {
    return next('/login')
  }
  
  next()
})

app.mount('#app')
