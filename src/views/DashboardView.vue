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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      <!-- Carte des véhicules -->
      <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
        <div class="bg-indigo-500 p-4 flex justify-between items-center">
          <h2 class="text-white font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
            Vos véhicules
          </h2>
          <div class="flex items-center gap-2">
            <router-link to="/vehicles" class="text-xs text-white hover:text-indigo-100 flex items-center">
              Voir tout
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
            <CountBadge :count="vehicles.length" color="white" class="bg-indigo-600" />
          </div>
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
          <div class="flex items-center gap-2">
            <router-link to="/appointments" class="text-xs text-white hover:text-emerald-100 flex items-center">
              Voir tout
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
            <CountBadge :count="pendingAppointments.length" color="white" class="bg-emerald-600" />
          </div>
        </div>
        
        <div class="p-4" :class="{ 'min-h-[200px]': true }">
          <div v-if="garageStore.loading" class="flex justify-center items-center h-full py-4">
            <span class="text-gray-500">Chargement...</span>
          </div>
          
          <ul v-else-if="pendingAppointments.length > 0" class="divide-y divide-gray-200">
            <li v-for="appointment in pendingAppointments" :key="appointment.id" class="py-3 hover:bg-gray-50 rounded transition-colors">
              <div class="block">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-800">{{ formatDate(appointment.date) }}</p>
                    <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicule.id) }}</p>
                    <p class="text-sm text-gray-500">{{ getGarageName(appointment.garage.id) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                      À venir
                    </div>
                    <button 
                      @click="downloadPdf(appointment.id)" 
                      class="inline-flex items-center p-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Télécharger PDF"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
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
      
      
    </div>
    
    <!-- Section des opérations à venir -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          Opérations à venir
        </h2>
      </div>
      
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div class="bg-blue-500 p-4 flex justify-between items-center">
          <h2 class="text-white font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Maintenance préventive
          </h2>
          <div class="flex items-center gap-2">
            <CountBadge :count="allUpcomingOperations.length" color="white" class="bg-blue-600" />
          </div>
        </div>
        
        <div v-if="operationsLoading" class="flex justify-center items-center h-full py-8">
          <span class="text-gray-500">Chargement des opérations...</span>
        </div>
        
        <div v-else-if="allUpcomingOperations.length === 0" class="p-8 text-center">
          <p class="text-gray-600">Aucune opération à venir pour vos véhicules.</p>
        </div>
        
        <div v-else>
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <div class="flex flex-wrap gap-3">
              <div class="flex items-center">
                <span class="text-sm text-gray-600 mr-2">Filtrer par:</span>
              </div>
              
              <div class="relative">
                <select 
                  v-model="selectedVehicleFilter" 
                  class="block w-40 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  @change="currentPage = 1"
                >
                  <option value="all">Tous les véhicules</option>
                  <option 
                    v-for="vehicle in vehicles" 
                    :key="vehicle.id" 
                    :value="vehicle.id"
                  >
                    {{ vehicle.brand }} {{ vehicle.model }}
                  </option>
                </select>
              </div>
              
              <div class="relative">
                <select 
                  v-model="operationSortBy" 
                  class="block w-40 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  @change="currentPage = 1"
                >
                  <option value="date">Date limite</option>
                  <option value="criticality">Criticité</option>
                </select>
              </div>
              
              <div class="relative">
                <select 
                  v-model="operationSortDirection" 
                  class="block w-40 pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  @change="currentPage = 1"
                >
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </div>
          </div>
          
          <ul class="divide-y divide-gray-200">
            <li v-for="(operation, index) in paginatedOperations" :key="index" class="p-4 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800">{{ operation.label }}</p>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">Véhicule:</span> {{ getVehicleName(operation.vehicleId) }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1">
                    <span class="font-medium">À effectuer dans:</span> {{ formatNextIn(operation.next_in_value, operation.next_in_unit) }}
                  </p>
                </div>
                
                <div class="flex flex-col items-end gap-2">
                  <div 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                    :class="getCriticalityClasses(operation.criticality)"
                  >
                    Priorité: {{ operation.criticality }}/9
                  </div>
                  
                  <div class="text-xs text-gray-500">
                    {{ getDeadlineDate(operation.next_in_value, operation.next_in_unit) }}
                  </div>
                  
                  <router-link 
                    :to="`/vehicles/${operation.vehicleId}`" 
                    class="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
                  >
                    Détails
                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </router-link>
                </div>
              </div>
            </li>
          </ul>
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div class="flex items-center">
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> à 
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredAndSortedOperations.length) }}</span> sur 
                <span class="font-medium">{{ filteredAndSortedOperations.length }}</span> opérations
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <select 
                v-model="itemsPerPage" 
                class="block w-20 pl-3 pr-10 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @change="currentPage = 1"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
              
              <div class="flex items-center space-x-2 ml-4">
                <button 
                  @click="goToPreviousPage" 
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :disabled="currentPage === 1"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                >
                  <span class="sr-only">Précédent</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                
                <button 
                  @click="goToNextPage" 
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :disabled="currentPage === totalPages"
                  :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                >
                  <span class="sr-only">Suivant</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
      
      <div v-if="locationError" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              {{ locationError }}
              <button @click="getLocation" class="font-medium underline ml-1">Réessayer</button>
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="locationLoading || nearbyGaragesLoading" class="flex justify-center items-center py-8">
        <span class="text-gray-500">{{ locationLoading ? 'Récupération de votre position...' : 'Recherche des garages à proximité...' }}</span>
      </div>
      
      <div v-else-if="nearbyGarages.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <p class="text-gray-600">Aucun garage trouvé à proximité.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="garage in nearbyGarages" :key="garage.id" 
             class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden border border-gray-100">
          <div class="p-5">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">{{ garage.name }}</h3>
            <div class="text-sm text-gray-600 mb-4">
              <p>{{ garage.address }}</p>
              <p>{{ garage.zipcode }} {{ garage.city }}</p>
              <p v-if="garage.distance" class="mt-1 text-indigo-600 font-medium">
                À {{ formatDistance(garage.distance) }}
              </p>
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
import { appointmentService, vehicleService } from '../js/api'

import PageLayout from '../components/PageLayout.vue'
import CountBadge from '../components/CountBadge.vue'
import EmptyState from '../components/EmptyState.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()
const user = computed(() => authStore.user)

const vehicleOperations = ref({})
const operationsLoading = ref(false)
const selectedVehicleFilter = ref('all')
const operationSortBy = ref('date')
const operationSortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(5)

const userLocation = ref(null)
const locationLoading = ref(false)
const locationError = ref(null)
const nearbyGarages = ref([])
const nearbyGaragesLoading = ref(false)

onMounted(async () => {
  try {
    await garageStore.initializeStore()
    await garageStore.fetchAppointments()
    
    getLocation()
    
    fetchAllVehicleOperations()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})

const getLocation = () => {
  locationLoading.value = true
  locationError.value = null
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        locationLoading.value = false
        fetchNearbyGarages()
      },
      (error) => {
        locationLoading.value = false
        switch(error.code) {
          case error.PERMISSION_DENIED:
            locationError.value = "Vous avez refusé l'accès à la géolocalisation."
            break
          case error.POSITION_UNAVAILABLE:
            locationError.value = "Votre position n'a pas pu être déterminée."
            break
          case error.TIMEOUT:
            locationError.value = "La requête a expiré."
            break
          default:
            locationError.value = "Une erreur inconnue s'est produite."
            break
        }
        nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
      }
    )
  } else {
    locationLoading.value = false
    locationError.value = "La géolocalisation n'est pas prise en charge par votre navigateur."
    nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
  }
}

const fetchNearbyGarages = async () => {
  if (!userLocation.value) return
  
  nearbyGaragesLoading.value = true
  
  try {
    if (!Array.isArray(garages.value) || garages.value.length === 0) {
      nearbyGarages.value = []
      return
    }
    
    const garagesWithCoordinates = garages.value.map(garage => {
      if (garage.latitude && garage.longitude) {
        return garage
      }
      
      const radius = 10 
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * radius
      
      const latOffset = distance * Math.cos(angle) / 111.32
      const lonOffset = distance * Math.sin(angle) / (111.32 * Math.cos(userLocation.value.latitude * Math.PI / 180))
      
      return {
        ...garage,
        latitude: userLocation.value.latitude + latOffset,
        longitude: userLocation.value.longitude + lonOffset
      }
    })
    
    const garagesWithDistance = garagesWithCoordinates.map(garage => {
      const distance = calculateDistance(
        userLocation.value.latitude,
        userLocation.value.longitude,
        garage.latitude,
        garage.longitude
      )
      return { ...garage, distance }
    })
    
    const sortedGarages = garagesWithDistance.sort((a, b) => a.distance - b.distance)
    
    nearbyGarages.value = sortedGarages.slice(0, 3)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des garages à proximité:', error)
    nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
  } finally {
    nearbyGaragesLoading.value = false
  }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c 
  return distance
}

const refreshNearbyGarages = () => {
  if (userLocation.value) {
    fetchNearbyGarages()
  } else {
    getLocation()
  }
}

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  } else {
    return `${distance.toFixed(1)} km`
  }
}

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
  if (!dateString) {
    return 'Date non définie';
  }
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Erreur de format de date';
  }
}

const getVehicleName = (vehicleId) => {
  if (!vehicleId) {
    return 'Véhicule non défini';
  }
  
  const vehicle = vehicles.value.find(v => {
    return v.id === vehicleId || 
           v.id === parseInt(vehicleId) || 
           v.vehicule_id === vehicleId || 
           v.vehicule_id === parseInt(vehicleId);
  });
  
  if (!vehicle) {
    return 'Véhicule inconnu';
  }
  
  return `${vehicle.brand} ${vehicle.model}`;
}

const getGarageName = (garageId) => {
  if (!garageId) {
    return 'Garage non défini';
  }
  
  const garage = garages.value.find(g => {
    return g.id === garageId || 
           g.id === parseInt(garageId) || 
           g.garage_id === garageId || 
           g.garage_id === parseInt(garageId);
  });
  
  if (!garage) {
    return 'Garage inconnu';
  }
  
  return garage.name;
}

const downloadPdf = async (appointmentId) => {
  try {
    const response = await appointmentService.getPdf(appointmentId);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `rendez-vous-${appointmentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    alert('Impossible de télécharger le PDF du rendez-vous');
  }
};

const fetchAllVehicleOperations = async () => {
  if (!Array.isArray(vehicles.value) || vehicles.value.length === 0) {
    return
  }
  
  operationsLoading.value = true
  
  try {
    for (const vehicle of vehicles.value) {
      await fetchVehicleOperations(vehicle.id)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des opérations des véhicules:', error)
  } finally {
    operationsLoading.value = false
  }
}

const fetchVehicleOperations = async (vehicleId) => {
  try {
    const response = await vehicleService.getOperations(vehicleId)
    if (response.data && response.data.operations) {
      const operationsWithVehicleId = response.data.operations.map(op => ({
        ...op,
        vehicleId
      }))
      vehicleOperations.value[vehicleId] = operationsWithVehicleId
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération des opérations pour le véhicule ${vehicleId}:`, error)
    
    try {
      const response = await vehicleService.getOperationsAlt1(vehicleId)
      if (response.data && response.data.operations) {
        const operationsWithVehicleId = response.data.operations.map(op => ({
          ...op,
          vehicleId
        }))
        vehicleOperations.value[vehicleId] = operationsWithVehicleId
      }
    } catch (error) {
      try {
        const response = await vehicleService.getOperationsAlt2(vehicleId)
        if (response.data && response.data.operations) {
          const operationsWithVehicleId = response.data.operations.map(op => ({
            ...op,
            vehicleId
          }))
          vehicleOperations.value[vehicleId] = operationsWithVehicleId
        }
      } catch (error) {
        vehicleOperations.value[vehicleId] = []
      }
    }
  }
}

const allUpcomingOperations = computed(() => {
  const allOperations = []
  for (const vehicleId in vehicleOperations.value) {
    if (Array.isArray(vehicleOperations.value[vehicleId])) {
      allOperations.push(...vehicleOperations.value[vehicleId])
    }
  }
  return allOperations
})

const filteredAndSortedOperations = computed(() => {
  let operations = [...allUpcomingOperations.value]
  
  if (selectedVehicleFilter.value !== 'all') {
    operations = operations.filter(op => op.vehicleId === selectedVehicleFilter.value)
  }
  
  if (operationSortBy.value === 'date') {
    operations.sort((a, b) => {
      const valueA = convertToCommonUnit(a.next_in_value, a.next_in_unit)
      const valueB = convertToCommonUnit(b.next_in_value, b.next_in_unit)
      return operationSortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    })
  } else if (operationSortBy.value === 'criticality') {
    operations.sort((a, b) => {
      return operationSortDirection.value === 'asc' 
        ? a.criticality - b.criticality 
        : b.criticality - a.criticality
    })
  }
  
  return operations
})

const paginatedOperations = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  return filteredAndSortedOperations.value.slice(startIndex, startIndex + itemsPerPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedOperations.value.length / itemsPerPage.value)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const convertToCommonUnit = (value, unit) => {
  switch(unit) {
    case 'days':
      return value
    case 'weeks':
      return value * 7
    case 'months':
      return value * 30
    case 'years':
      return value * 365
    default:
      return value
  }
}

const formatNextIn = (value, unit) => {
  const unitMap = {
    'days': value > 1 ? 'jours' : 'jour',
    'weeks': value > 1 ? 'semaines' : 'semaine',
    'months': value > 1 ? 'mois' : 'mois',
    'years': value > 1 ? 'ans' : 'an'
  }
  
  return `${value} ${unitMap[unit] || unit}`
}

const getDeadlineDate = (value, unit) => {
  const today = new Date()
  let deadline = new Date(today)
  
  switch(unit) {
    case 'days':
      deadline.setDate(today.getDate() + value)
      break
    case 'weeks':
      deadline.setDate(today.getDate() + (value * 7))
      break
    case 'months':
      deadline.setMonth(today.getMonth() + value)
      break
    case 'years':
      deadline.setFullYear(today.getFullYear() + value)
      break
  }
  
  return formatDate(deadline)
}

const getCriticalityClasses = (criticality) => {
  if (criticality >= 1 && criticality <= 3) {
    return 'bg-green-100 text-green-800'
  } else if (criticality >= 4 && criticality <= 6) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

const formatDateWithoutTime = (dateObj) => {
  if (!dateObj) {
    return 'Date non définie';
  }
  
  try {
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Erreur de format de date';
  }
}
</script>