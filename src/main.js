import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './js/api'

api.defaults.baseURL = 'http://localhost:8000/api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useGarageStore } from './stores/garage'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
authStore.checkAuth()

const garageStore = useGarageStore()
garageStore.initializeStore()

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
