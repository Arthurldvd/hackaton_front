<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl font-semibold text-gray-900">Mes rendez-vous</h1>
        <router-link 
          to="/appointment" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto justify-center"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Prendre rendez-vous
        </router-link>
      </div>
      
      <!-- Filtres -->
      <div class="mb-6 bg-white p-4 shadow rounded-lg">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="w-full sm:w-auto">
            <div class="flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Statut
              </span>
              <select 
                v-model="statusFilter"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmés</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
          </div>
          <div class="w-full sm:w-auto">
            <button 
              type="button" 
              @click="loadAppointments"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
      
      <!-- Liste vide -->
      <div v-if="filteredAppointments.length === 0" class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
        <p class="mt-1 text-sm text-gray-500">
          Prenez rendez-vous pour l'entretien ou la réparation de votre véhicule.
        </p>
        <div class="mt-6">
          <router-link 
            to="/appointment" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Prendre rendez-vous
          </router-link>
        </div>
      </div>
      
      <!-- Liste des rendez-vous -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="appointment in filteredAppointments" :key="appointment.id" class="px-4 py-4 sm:px-6 sm:py-5 hover:bg-gray-50">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-shrink-0">
                <div :class="`h-12 w-12 rounded-full flex items-center justify-center ${getStatusClasses(appointment.status).bg}`">
                  <svg class="h-6 w-6" :class="getStatusClasses(appointment.status).text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p class="text-lg font-medium text-gray-900 truncate">
                    {{ formatDate(appointment.appointmentDatetime) }}
                  </p>
                  <span :class="getStatusClasses(appointment.status).badge">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </div>
                <div class="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {{ getGarageName(appointment.garageId) }}
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {{ getVehicleName(appointment.vehicleId) }}
                  </div>
                </div>
                <div class="mt-1 text-sm text-gray-500">
                  {{ getOperationsSummary(appointment.id) }}
                </div>
              </div>
              <div class="mt-3 sm:mt-0 w-full sm:w-auto">
                <router-link 
                  :to="`/appointments/${appointment.id}`" 
                  class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Détails
                </router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()

const isLoading = ref(false)
const statusFilter = ref('all')

// Récupération de tous les rendez-vous de tous les véhicules de l'utilisateur
const appointments = computed(() => {
  const userVehicles = garageStore.getVehiclesByClientId(authStore.user.id)
  
  // Récupérer tous les rendez-vous pour ces véhicules
  return userVehicles.flatMap(vehicle => 
    garageStore.getAppointmentsByVehicleId(vehicle.id)
  )
})

// Filtrer les rendez-vous par statut
const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') {
    return appointments.value.sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
  }
  
  return appointments.value
    .filter(appointment => appointment.status === statusFilter.value)
    .sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
})

// Fonctions utilitaires
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getGarageName = (garageId) => {
  const garage = garageStore.garages.find(g => g.id === garageId)
  return garage ? garage.name : 'Garage inconnu'
}

const getVehicleName = (vehicleId) => {
  const vehicle = garageStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Véhicule inconnu'
}

const getOperationsSummary = (appointmentId) => {
  const operations = garageStore.getOperationsByAppointmentId(appointmentId)
  
  if (operations.length === 0) {
    return "Aucune opération"
  }
  
  if (operations.length === 1) {
    return operations[0].name
  }
  
  return `${operations[0].name} + ${operations.length - 1} autre(s)`
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'cancelled': 'Annulé',
    'completed': 'Terminé'
  }
  
  return statusMap[status] || status
}

const getStatusClasses = (status) => {
  const classesMap = {
    'pending': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
    },
    'confirmed': {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    },
    'cancelled': {
      bg: 'bg-red-100',
      text: 'text-red-600',
      badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
    },
    'completed': {
      bg: 'bg-green-100',
      text: 'text-green-600',
      badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
    }
  }
  
  return classesMap[status] || classesMap['pending']
}

const loadAppointments = () => {
  // Cette fonction est un placeholder pour simuler une actualisation
  // Dans une vraie application, elle appellerait une API
  isLoading.value = true
  
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

onMounted(() => {
  loadAppointments()
})
</script> 