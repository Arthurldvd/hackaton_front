<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="!appointment" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Rendez-vous non trouvé</h3>
        <p class="mt-1 text-sm text-gray-500">
          Le rendez-vous demandé n'existe pas ou n'est pas accessible.
        </p>
        <div class="mt-6">
          <router-link to="/appointments" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Retour à la liste des rendez-vous
          </router-link>
        </div>
      </div>
      
      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <div>
            <router-link to="/appointments" class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900 mb-2">
              <svg class="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Retour aux rendez-vous
            </router-link>
            <h1 class="text-2xl font-semibold text-gray-900">Détails du rendez-vous</h1>
          </div>
          <span :class="getStatusClasses(appointment.status).badge">
            {{ getStatusText(appointment.status) }}
          </span>
        </div>
        
        <!-- Informations principales -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Informations générales</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Détails du rendez-vous</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white">
                <dt class="text-sm font-medium text-gray-500">Date et heure</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(appointment.appointmentDatetime) }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-sm font-medium text-gray-500">Garage</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ getGarageName(appointment.garageId) }}
                  <p v-if="garage" class="mt-1 text-sm text-gray-500">
                    {{ garage.address }}, {{ garage.zipcode }} {{ garage.city }}
                  </p>
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white">
                <dt class="text-sm font-medium text-gray-500">Véhicule</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ getVehicleInfo(appointment.vehicleId) }}
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-sm font-medium text-gray-500">Statut</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span :class="getStatusClasses(appointment.status).badge">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ appointment.notes || "Aucune note" }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <!-- Opérations -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Opérations prévues</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Liste des interventions à effectuer</p>
          </div>
          <div class="border-t border-gray-200">
            <div v-if="operations.length === 0" class="px-4 py-5 sm:px-6 text-center">
              <p class="text-sm text-gray-500">Aucune opération prévue pour ce rendez-vous</p>
            </div>
            <ul v-else role="list" class="divide-y divide-gray-200">
              <li v-for="operation in operations" :key="operation.id" class="px-4 py-4 sm:px-6">
                <div class="flex justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ operation.name }}</h4>
                    <p v-if="operation.additionalHelp" class="mt-1 text-sm text-gray-500">{{ operation.additionalHelp }}</p>
                    <p v-if="operation.additionalComment" class="mt-1 text-xs italic text-gray-500">{{ operation.additionalComment }}</p>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(operation.price) }}
                  </div>
                </div>
              </li>
              <li class="px-4 py-4 sm:px-6 bg-gray-50">
                <div class="flex justify-between font-medium">
                  <span class="text-sm text-gray-900">Total</span>
                  <span class="text-sm text-gray-900">{{ formatPrice(totalPrice) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Actions</h3>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <router-link 
                :to="`/appointment?vehicleId=${appointment.vehicleId}`" 
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Nouveau rendez-vous
              </router-link>
              
              <button 
                v-if="appointment.status === 'pending'"
                @click="cancelAppointment"
                :disabled="isUpdating"
                class="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="-ml-1 mr-2 h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ isUpdating ? 'Annulation en cours...' : 'Annuler le rendez-vous' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const garageStore = useGarageStore()

const appointmentId = route.params.id
const isUpdating = ref(false)

const appointment = computed(() => {
  return garageStore.appointments.find(a => a.id === appointmentId)
})

const operations = computed(() => {
  if (!appointment.value) return []
  return garageStore.getOperationsByAppointmentId(appointmentId)
})

const totalPrice = computed(() => {
  return operations.value.reduce((sum, operation) => sum + operation.price, 0)
})

const garage = computed(() => {
  if (!appointment.value) return null
  return garageStore.garages.find(g => g.id === appointment.value.garageId)
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

const getVehicleInfo = (vehicleId) => {
  const vehicle = garageStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule inconnu'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
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

const cancelAppointment = async () => {
  if (!appointment.value || appointment.value.status !== 'pending') return
  
  try {
    isUpdating.value = true
    
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mettre à jour le statut du rendez-vous
    garageStore.updateAppointmentStatus(appointmentId, 'cancelled')
    
  } catch (error) {
    console.error('Erreur lors de l\'annulation du rendez-vous:', error)
  } finally {
    isUpdating.value = false
  }
}
</script> 