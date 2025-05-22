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
import { appointmentService } from '../js/api'

import PageLayout from '../components/PageLayout.vue'
import CountBadge from '../components/CountBadge.vue'
import EmptyState from '../components/EmptyState.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()
const user = computed(() => authStore.user)

// Variables pour la géolocalisation
const userLocation = ref(null)
const locationLoading = ref(false)
const locationError = ref(null)
const nearbyGarages = ref([])
const nearbyGaragesLoading = ref(false)

onMounted(async () => {
  try {
    // Initialiser le store pour charger les données
    await garageStore.initializeStore()
    await garageStore.fetchAppointments()
    
    // Récupérer la position de l'utilisateur
    getLocation()
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
        // Utiliser les garages par défaut en cas d'erreur
        nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
      }
    )
  } else {
    locationLoading.value = false
    locationError.value = "La géolocalisation n'est pas prise en charge par votre navigateur."
    // Utiliser les garages par défaut en cas d'erreur
    nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
  }
}

const fetchNearbyGarages = async () => {
  if (!userLocation.value) return
  
  nearbyGaragesLoading.value = true
  
  try {
    // Pour le moment, utilisons les garages locaux et simulons la distance
    // Quand l'API sera prête, décommentez le code d'appel API ci-dessous
    
    /* 
    // Code pour appeler l'API - À activer quand l'API sera disponible
    const response = await fetch(`/api/v1/garages?latitude=${userLocation.value.latitude}&longitude=${userLocation.value.longitude}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Type de contenu non valide: ${contentType}`)
    }
    
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('La réponse n\'est pas un tableau')
    }
    
    // Tri et sélection des 3 premiers garages
    const sortedGarages = data.sort((a, b) => 
      (a.distance || Infinity) - (b.distance || Infinity)
    )
    
    nearbyGarages.value = sortedGarages.slice(0, 3)
    */
    
    // Utiliser les garages locaux et calculer la distance pour chacun
    if (!Array.isArray(garages.value) || garages.value.length === 0) {
      nearbyGarages.value = []
      return
    }
    
    // On simule des coordonnées pour les garages qui n'en ont pas
    const garagesWithCoordinates = garages.value.map(garage => {
      // Si le garage a déjà des coordonnées, on les utilise
      if (garage.latitude && garage.longitude) {
        return garage
      }
      
      // Sinon, on génère des coordonnées proches de l'utilisateur (rayon de 10km)
      const radius = 10 // km
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * radius
      
      // Conversion approximative des degrés en km
      const latOffset = distance * Math.cos(angle) / 111.32
      const lonOffset = distance * Math.sin(angle) / (111.32 * Math.cos(userLocation.value.latitude * Math.PI / 180))
      
      return {
        ...garage,
        latitude: userLocation.value.latitude + latOffset,
        longitude: userLocation.value.longitude + lonOffset
      }
    })
    
    // Calculer la distance pour chaque garage
    const garagesWithDistance = garagesWithCoordinates.map(garage => {
      const distance = calculateDistance(
        userLocation.value.latitude,
        userLocation.value.longitude,
        garage.latitude,
        garage.longitude
      )
      return { ...garage, distance }
    })
    
    // Trier par distance
    const sortedGarages = garagesWithDistance.sort((a, b) => a.distance - b.distance)
    
    // Prendre les 3 plus proches
    nearbyGarages.value = sortedGarages.slice(0, 3)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des garages à proximité:', error)
    // Fallback: utiliser les garages locaux sans calcul de distance
    nearbyGarages.value = Array.isArray(garages.value) ? garages.value.slice(0, 3) : []
  } finally {
    nearbyGaragesLoading.value = false
  }
}

// Fonction pour calculer la distance entre deux points géographiques (formule de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c // Distance en km
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
    
    // Vérifier si la date est valide
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
  
  // Essayer plusieurs propriétés d'identifiant possibles
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
  
  // Essayer plusieurs propriétés d'identifiant possibles
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
</script>