<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p class="mt-2 text-gray-600">Bienvenue, {{ user.firstName }} {{ user.lastName }}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Carte Véhicules -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-indigo-50">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-indigo-800">Vos véhicules</h2>
              <span class="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                {{ vehicles.length }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <ul v-if="vehicles.length > 0" class="divide-y divide-gray-200">
              <li v-for="vehicle in vehicles" :key="vehicle.id" class="py-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</p>
                    <p class="text-sm text-gray-500">{{ vehicle.licensePlate }}</p>
                  </div>
                  <router-link :to="`/vehicles/${vehicle.id}`" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    Détails
                  </router-link>
                </div>
              </li>
            </ul>
            <div v-else class="text-center py-4">
              <p class="text-gray-500">Aucun véhicule enregistré</p>
            </div>
            <div class="mt-4">
              <router-link to="/vehicles/add" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un véhicule
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Carte Rendez-vous -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-green-50">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-green-800">Rendez-vous à venir</h2>
              <span class="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                {{ pendingAppointments.length }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <ul v-if="pendingAppointments.length > 0" class="divide-y divide-gray-200">
              <li v-for="appointment in pendingAppointments" :key="appointment.id" class="py-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ formatDate(appointment.appointmentDatetime) }}</p>
                    <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicleId) }}</p>
                    <p class="text-sm text-gray-500">{{ getGarageName(appointment.garageId) }}</p>
                  </div>
                  <router-link :to="`/appointments/${appointment.id}`" class="text-green-600 hover:text-green-900 text-sm font-medium">
                    Détails
                  </router-link>
                </div>
              </li>
            </ul>
            <div v-else class="text-center py-4">
              <p class="text-gray-500">Aucun rendez-vous à venir</p>
            </div>
            <div class="mt-4">
              <router-link to="/appointment" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prendre rendez-vous
              </router-link>
            </div>
          </div>
        </div>
        
        <!-- Carte Historique -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-semibold text-gray-800">Historique</h2>
          </div>
          <div class="p-6">
            <ul v-if="completedAppointments.length > 0" class="divide-y divide-gray-200">
              <li v-for="appointment in completedAppointments" :key="appointment.id" class="py-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ formatDate(appointment.appointmentDatetime) }}</p>
                    <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicleId) }}</p>
                    <p class="text-sm text-gray-500">{{ getGarageName(appointment.garageId) }}</p>
                  </div>
                  <router-link :to="`/appointments/${appointment.id}`" class="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Détails
                  </router-link>
                </div>
              </li>
            </ul>
            <div v-else class="text-center py-4">
              <p class="text-gray-500">Aucun rendez-vous passé</p>
            </div>
            <div class="mt-4">
              <router-link to="/appointments" class="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
                <span>Voir tout l'historique</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Garages à proximité -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Garages à proximité</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="garage in garages" :key="garage.id" class="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <h3 class="font-medium text-gray-900">{{ garage.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ garage.address }}</p>
              <p class="text-sm text-gray-500">{{ garage.zipcode }} {{ garage.city }}</p>
              <div class="mt-4">
                <router-link 
                  :to="`/appointment?garageId=${garage.id}`" 
                  class="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                >
                  <span>Prendre rendez-vous</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()

const user = computed(() => authStore.user)
const garages = computed(() => garageStore.garages)

const vehicles = computed(() => {
  return garageStore.getVehiclesByClientId(user.value.id)
})

const appointments = computed(() => {
  return vehicles.value.flatMap(vehicle => 
    garageStore.getAppointmentsByVehicleId(vehicle.id)
  )
})

const pendingAppointments = computed(() => {
  return appointments.value
    .filter(appointment => ['pending', 'confirmed'].includes(appointment.status))
    .sort((a, b) => new Date(a.appointmentDatetime) - new Date(b.appointmentDatetime))
    .slice(0, 3) // Limiter à 3 rendez-vous à venir
})

const completedAppointments = computed(() => {
  return appointments.value
    .filter(appointment => appointment.status === 'completed')
    .sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
    .slice(0, 3) // Limiter à 3 rendez-vous passés
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

const getVehicleName = (vehicleId) => {
  const vehicle = garageStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Véhicule inconnu'
}

const getGarageName = (garageId) => {
  const garage = garageStore.garages.find(g => g.id === garageId)
  return garage ? garage.name : 'Garage inconnu'
}
</script> 