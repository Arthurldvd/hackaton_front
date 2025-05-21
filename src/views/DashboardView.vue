<template>
  <PageLayout>
    <!-- Entête avec informations utilisateur et statistiques -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8">
      <div class="flex flex-col md:flex-row justify-between">
        <div class="text-white mb-4 md:mb-0">
          <h1 class="text-2xl font-bold">Bonjour, {{ user.firstName || 'utilisateur' }} 👋</h1>
          <p class="text-indigo-100 mt-1">Bienvenue sur votre espace personnel</p>
        </div>
        <div class="flex space-x-4">
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-center min-w-[100px]">
            <p class="text-2xl font-bold">{{ vehicles.length }}</p>
            <p class="text-xs text-indigo-100">Véhicules</p>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white text-center min-w-[100px]">
            <p class="text-2xl font-bold">{{ pendingAppointments.length }}</p>
            <p class="text-xs text-indigo-100">Rendez-vous</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cartes principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Carte des véhicules -->
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
        <div class="bg-indigo-500 p-4 flex justify-between items-center">
          <h2 class="text-white font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            Vos véhicules
          </h2>
          <CountBadge :count="vehicles.length" color="white" class="bg-indigo-600" />
        </div>
        
        <div class="p-4" :class="{ 'min-h-[200px]': true }">
          <div v-if="garageStore.loading" class="flex justify-center items-center h-full py-4">
            <span class="text-gray-500">Chargement...</span>
          </div>
          
          <ul v-else-if="vehicles.length > 0" class="divide-y divide-gray-200">
            <li v-for="vehicle in vehicles" :key="vehicle.id" class="py-3 hover:bg-gray-50 rounded transition-colors">
              <router-link :to="`/vehicles/${vehicle.id}`" class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-800">{{ vehicle.brand }} {{ vehicle.model }}</p>
                  <p class="text-sm text-gray-500">{{ vehicle.license_plate }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </li>
          </ul>
          
          <EmptyState v-else message="Aucun véhicule enregistré" simple />
        </div>
        
        <div class="bg-gray-50 p-4 border-t border-gray-100">
          <router-link to="/vehicles/add" class="flex justify-center items-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un véhicule
          </router-link>
        </div>
      </div>
      
      <!-- Carte des rendez-vous -->
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
        <div class="bg-emerald-500 p-4 flex justify-between items-center">
          <h2 class="text-white font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Rendez-vous à venir
          </h2>
          <CountBadge :count="pendingAppointments.length" color="white" class="bg-emerald-600" />
        </div>
        
        <div class="p-4" :class="{ 'min-h-[200px]': true }">
          <div v-if="garageStore.loading" class="flex justify-center items-center h-full py-4">
            <span class="text-gray-500">Chargement...</span>
          </div>
          
          <ul v-else-if="pendingAppointments.length > 0" class="divide-y divide-gray-200">
            <li v-for="appointment in pendingAppointments" :key="appointment.id" class="py-3 hover:bg-gray-50 rounded transition-colors">
              <router-link :to="`/appointments/${appointment.id}`" class="block">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-800">{{ formatDate(appointment.date) }}</p>
                    <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicule_id) }}</p>
                    <p class="text-sm text-gray-500">{{ getGarageName(appointment.garage_id) }}</p>
                  </div>
                  <div class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                    À venir
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
          
          <EmptyState v-else message="Aucun rendez-vous à venir" simple />
        </div>
        
        <div class="bg-gray-50 p-4 border-t border-gray-100">
          <router-link to="/appointment" class="flex justify-center items-center py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Prendre rendez-vous
          </router-link>
        </div>
      </div>
      
      <!-- Carte de l'historique -->
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
        <div class="bg-gray-700 p-4 flex justify-between items-center">
          <h2 class="text-white font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historique
          </h2>
        </div>
        
        <div class="p-4" :class="{ 'min-h-[200px]': true }">
          <div v-if="garageStore.loading" class="flex justify-center items-center h-full py-4">
            <span class="text-gray-500">Chargement...</span>
          </div>
          
          <ul v-else-if="completedAppointments.length > 0" class="divide-y divide-gray-200">
            <li v-for="appointment in completedAppointments" :key="appointment.id" class="py-3 hover:bg-gray-50 rounded transition-colors">
              <router-link :to="`/appointments/${appointment.id}`" class="block">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-800">{{ formatDate(appointment.date) }}</p>
                    <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicule_id) }}</p>
                    <p class="text-sm text-gray-500">{{ getGarageName(appointment.garage_id) }}</p>
                  </div>
                  <div class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
                    Terminé
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
          
          <EmptyState v-else message="Aucun rendez-vous passé" simple />
        </div>
        
        <div class="bg-gray-50 p-4 border-t border-gray-100">
          <router-link to="/appointments" class="flex justify-center items-center py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Voir tout l'historique
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Section des garages à proximité -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          Garages à proximité
        </h2>
      </div>
      
      <div v-if="garageStore.loading" class="flex justify-center items-center py-8">
        <span class="text-gray-500">Chargement des garages...</span>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="garage in Array.isArray(garages) ? garages.slice(0, 3) : []" :key="garage.id" 
             class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden border border-gray-100">
          <div class="p-5">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ garage.name }}</h3>
            <div class="text-sm text-gray-600 mb-4">
              <p>{{ garage.address }}</p>
              <p>{{ garage.zipcode }} {{ garage.city }}</p>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex space-x-2">
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ouvert</span>
              </div>
              
              <router-link :to="`/appointment?garageId=${garage.id}`" 
                           class="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center">
                <span>Prendre rendez-vous</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'

import PageLayout from '../components/PageLayout.vue'
import CountBadge from '../components/CountBadge.vue'
import EmptyState from '../components/EmptyState.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()
const user = computed(() => authStore.user)

onMounted(async () => {
  try {
    // Initialiser le store pour charger les données
    await garageStore.initializeStore()
    await garageStore.fetchAppointments()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

const garages = computed(() => garageStore.garages)
const vehicles = computed(() => garageStore.vehicles)
const appointments = computed(() => garageStore.appointments)

const pendingAppointments = computed(() => {
  return appointments.value
    .filter(appointment => ['scheduled', 'confirmed'].includes(appointment.status))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)
})

const completedAppointments = computed(() => {
  return appointments.value
    .filter(appointment => appointment.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
})

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
  const vehicle = vehicles.value.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Véhicule inconnu'
}

const getGarageName = (garageId) => {
  const garage = garages.value.find(g => g.id === garageId)
  return garage ? garage.name : 'Garage inconnu'
}
</script>