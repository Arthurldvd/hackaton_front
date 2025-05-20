<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="!vehicle" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Véhicule non trouvé</h3>
        <p class="mt-1 text-sm text-gray-500">
          Le véhicule demandé n'existe pas ou n'est pas accessible.
        </p>
        <div class="mt-6">
          <router-link to="/vehicles" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Retour à la liste des véhicules
          </router-link>
        </div>
      </div>
      
      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ vehicle.brand }} {{ vehicle.model }}</h1>
            <p class="mt-1 text-sm text-gray-500">Plaque d'immatriculation: {{ vehicle.licensePlate }}</p>
          </div>
          <div class="flex space-x-3">
            <router-link 
              :to="`/appointment?vehicleId=${vehicle.id}`" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Prendre rendez-vous
            </router-link>
          </div>
        </div>
        
        <!-- Informations du véhicule -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Informations du véhicule</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Détails et caractéristiques</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-sm font-medium text-gray-500">Marque</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ vehicle.brand }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Modèle</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ vehicle.model }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-sm font-medium text-gray-500">Plaque d'immatriculation</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ vehicle.licensePlate }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Numéro d'identification (VIN)</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ vehicle.vin }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt class="text-sm font-medium text-gray-500">Date de mise en circulation</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(vehicle.registrationDate) }}</dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Kilométrage</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ vehicle.mileage.toLocaleString('fr-FR') }} km</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <!-- Historique des rendez-vous -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Historique des rendez-vous</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Liste des interventions passées et à venir</p>
          </div>
          <div class="border-t border-gray-200">
            <div v-if="vehicleAppointments.length === 0" class="p-6 text-center">
              <p class="text-gray-500">Aucun rendez-vous enregistré pour ce véhicule</p>
              <div class="mt-4">
                <router-link 
                  :to="`/appointment?vehicleId=${vehicle.id}`" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Prendre rendez-vous
                </router-link>
              </div>
            </div>
            <ul v-else role="list" class="divide-y divide-gray-200">
              <li v-for="appointment in vehicleAppointments" :key="appointment.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div :class="`h-10 w-10 rounded-full flex items-center justify-center ${getStatusClasses(appointment.status).bg}`">
                        <svg class="h-6 w-6" :class="getStatusClasses(appointment.status).text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatDate(appointment.appointmentDatetime, true) }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        {{ getGarageName(appointment.garageId) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        <span :class="getStatusClasses(appointment.status).badge">
                          {{ getStatusText(appointment.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <router-link :to="`/appointments/${appointment.id}`" class="text-indigo-600 hover:text-indigo-900">
                      Détails
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'

const route = useRoute()
const garageStore = useGarageStore()

const vehicleId = route.params.id

const vehicle = computed(() => {
  return garageStore.vehicles.find(v => v.id === vehicleId)
})

const vehicleAppointments = computed(() => {
  if (!vehicle.value) return []
  
  return garageStore.getAppointmentsByVehicleId(vehicleId)
    .sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
})

const formatDate = (dateString, withTime = false) => {
  const date = new Date(dateString)
  
  if (withTime) {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

const getGarageName = (garageId) => {
  const garage = garageStore.garages.find(g => g.id === garageId)
  return garage ? garage.name : 'Garage inconnu'
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
</script> 