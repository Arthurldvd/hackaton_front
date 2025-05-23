<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/dashboard" class="text-xl font-bold text-indigo-600">
              Car Appointment
            </router-link>
          </div>
          <nav class="hidden md:ml-8 md:flex md:space-x-4">
            <router-link 
              to="/dashboard" 
              active-class="border-indigo-500 text-gray-900"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path === '/dashboard' }"
            >
              Tableau de bord
            </router-link>
            
            <router-link 
              to="/vehicles" 
              active-class="border-indigo-500 text-gray-900"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path.startsWith('/vehicle') }"
            >
              Mes véhicules
            </router-link>
            
            <router-link 
              to="/appointments" 
              active-class="border-indigo-500 text-gray-900"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path.startsWith('/appointment') }"
            >
              Rendez-vous
            </router-link>

            <a 
              href="http://localhost:3000" 
              target="_blank"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path.startsWith('/chatbot') }"
            >
              Chatbot
            </a>
          </nav>
        </div>
        
        <div class="flex items-center md:hidden">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" 
            aria-controls="mobile-menu" 
            :aria-expanded="isMobileMenuOpen"
          >
            <span class="sr-only">Ouvrir le menu principal</span>
            <svg 
              v-if="!isMobileMenuOpen" 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              v-else 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="hidden md:flex md:items-center">
          <div class="relative">
            <button 
              type="button" 
              class="max-w-xs bg-white flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
              <span class="sr-only">Ouvrir le menu utilisateur</span>
              <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                {{ user?.firstName?.charAt(0) || '?' }}{{ user?.lastName?.charAt(0) || '' }}
              </div>
              <span class="ml-2 text-gray-700">{{ user?.firstName || 'Utilisateur' }} {{ user?.lastName || '' }}</span>
              <svg 
                class="ml-1 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div 
              v-if="isUserMenuOpen" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu" 
              aria-orientation="vertical" 
              aria-labelledby="user-menu-button"
              @mouseleave="isUserMenuOpen = false"
            >
              <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                {{ user.email }}
              </div>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" @click.prevent="handleLogout">
                Se déconnecter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isMobileMenuOpen" class="md:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1 border-t border-gray-200">
        <router-link 
          to="/dashboard" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path === '/dashboard' 
            ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="isMobileMenuOpen = false"
        >
          Tableau de bord
        </router-link>
        
        <router-link 
          to="/vehicles" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path.startsWith('/vehicle') 
            ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="isMobileMenuOpen = false"
        >
          Mes véhicules
        </router-link>
        
        <router-link 
          to="/appointments" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path.startsWith('/appointment') 
            ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          @click="isMobileMenuOpen = false"
        >
          Rendez-vous
        </router-link>
      </div>
      
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
              {{ user?.firstName?.charAt(0) || '?' }}{{ user?.lastName?.charAt(0) || '' }}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.firstName || 'Utilisateur' }} {{ user?.lastName || '' }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <a 
            href="#" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            @click.prevent="handleLogout"
          >
            Se déconnecter
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isUserMenuOpen.value = false
  isMobileMenuOpen.value = false
}
</script> 