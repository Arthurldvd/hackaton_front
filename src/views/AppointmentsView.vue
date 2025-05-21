<template>
  <PageLayout title="Mes rendez-vous">
    <template #header-actions>
      <router-link to="/appointment">
        <ActionButton>
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Prendre rendez-vous
        </ActionButton>
      </router-link>
    </template>
    
    <FilterBar>
      <StatusSelect 
        v-model="statusFilter"
        :options="statusOptions"
      />
      
      <ActionButton 
        variant="secondary"
        @click="loadAppointments"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </ActionButton>
    </FilterBar>
    
    <EmptyState 
      v-if="filteredAppointments.length === 0"
      title="Aucun rendez-vous"
      description="Prenez rendez-vous pour l'entretien ou la réparation de votre véhicule."
    >
      <template #action>
        <router-link to="/appointment">
          <ActionButton>
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Prendre rendez-vous
          </ActionButton>
        </router-link>
      </template>
    </EmptyState>
    
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul role="list" class="divide-y divide-gray-200">
        <AppointmentItem 
          v-for="appointment in filteredAppointments" 
          :key="appointment.id"
          :appointment="appointment"
          :formatted-date="formatDate(appointment.appointmentDatetime)"
          :garage-name="getGarageName(appointment.garageId)"
          :vehicle-name="getVehicleName(appointment.vehicleId)"
          :operations-summary="getOperationsSummary(appointment.id)"
          :status-text="getStatusText(appointment.status)"
          :status-classes="getStatusClasses(appointment.status)"
        >
          <template #actions>
            <router-link :to="`/appointments/${appointment.id}`">
              <ActionButton variant="secondary">
                Détails
              </ActionButton>
            </router-link>
          </template>
        </AppointmentItem>
      </ul>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'

import PageLayout from '../components/PageLayout.vue'
import ActionButton from '../components/ActionButton.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusSelect from '../components/StatusSelect.vue'
import EmptyState from '../components/EmptyState.vue'
import AppointmentItem from '../components/AppointmentItem.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()

const isLoading = ref(false)
const statusFilter = ref('all')

const statusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'completed', label: 'Terminés' },
  { value: 'cancelled', label: 'Annulés' }
]

const appointments = computed(() => {
  const userVehicles = garageStore.getVehiclesByClientId(authStore.user.id)
  
  return userVehicles.flatMap(vehicle => 
    garageStore.getAppointmentsByVehicleId(vehicle.id)
  )
})

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') {
    return appointments.value.sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
  }
  
  return appointments.value
    .filter(appointment => appointment.status === statusFilter.value)
    .sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
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
  isLoading.value = true
  
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}

onMounted(() => {
  loadAppointments()
})
</script> 