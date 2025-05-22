import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import { useAuthStore } from '../stores/auth'

const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

const requireNoAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: requireNoAuth
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      beforeEnter: requireNoAuth
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/VehiclesView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/vehicles/add',
      name: 'add-vehicle',
      component: () => import('../views/AddVehicleView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle-details',
      component: () => import('../views/VehicleDetailsView.vue'),
      beforeEnter: requireAuth,
      props: true
    },
    {
      path: '/appointment',
      name: 'new-appointment',
      component: () => import('../views/AppointmentView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: () => import('../views/AppointmentsView.vue'),
      beforeEnter: requireAuth
    }
  ],
})

export default router
