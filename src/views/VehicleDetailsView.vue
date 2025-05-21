<template>
  <PageLayout :title="vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Détails du véhicule'">
    <template v-if="vehicle" #header-actions>
      <router-link 
        :to="`/appointment?vehicleId=${vehicle.id}`" 
        class="inline-flex items-center"
      >
        <ActionButton>
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Prendre rendez-vous
        </ActionButton>
      </router-link>
    </template>

    <EmptyState 
      v-if="!vehicle" 
      title="Véhicule non trouvé"
      description="Le véhicule demandé n'existe pas ou n'est pas accessible."
    >
      <template #icon>
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </template>
      
      <template #action>
        <router-link to="/vehicles">
          <ActionButton>
            Retour à la liste des véhicules
          </ActionButton>
        </router-link>
      </template>
    </EmptyState>
    
    <template v-else>
      <div class="px-4 py-3 sm:px-6 text-gray-500 text-sm border-b border-gray-200">
        Plaque d'immatriculation: {{ vehicle.licensePlate }}
      </div>
      
      <InfoSection 
        title="Informations du véhicule" 
        description="Détails et caractéristiques"
      >
        <dl>
          <DetailItem label="Marque" :alternate="true">
            {{ vehicle.brand }}
          </DetailItem>
          
          <DetailItem label="Modèle">
            {{ vehicle.model }}
          </DetailItem>
          
          <DetailItem label="Plaque d'immatriculation" :alternate="true">
            {{ vehicle.licensePlate }}
          </DetailItem>
          
          <DetailItem label="Numéro d'identification (VIN)">
            {{ vehicle.vin }}
          </DetailItem>
          
          <DetailItem label="Date de mise en circulation" :alternate="true">
            {{ formatDate(vehicle.registrationDate) }}
          </DetailItem>
          
          <DetailItem label="Kilométrage">
            {{ vehicle.mileage.toLocaleString('fr-FR') }} km
          </DetailItem>
        </dl>
      </InfoSection>
      
      <InfoSection 
        title="Historique des rendez-vous" 
        description="Liste des interventions passées et à venir"
      >
        <div v-if="vehicleAppointments.length === 0" class="p-6 text-center">
          <p class="text-gray-500">Aucun rendez-vous enregistré pour ce véhicule</p>
          <div class="mt-4">
            <router-link :to="`/appointment?vehicleId=${vehicle.id}`">
              <ActionButton>
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prendre rendez-vous
              </ActionButton>
            </router-link>
          </div>
        </div>
        
        <ul v-else role="list" class="divide-y divide-gray-200">
          <AppointmentItem
            v-for="appointment in vehicleAppointments"
            :key="appointment.id"
            :appointment="appointment"
            :formatted-date="formatDate(appointment.appointmentDatetime, true)"
            :garage-name="getGarageName(appointment.garageId)"
            :status-text="getStatusText(appointment.status)"
            :status-classes="getStatusClasses(appointment.status)"
            :compact="true"
          >
            <template #actions>
              <router-link :to="`/appointments/${appointment.id}`" class="text-indigo-600 hover:text-indigo-900">
                Détails
              </router-link>
            </template>
          </AppointmentItem>
        </ul>
      </InfoSection>
    </template>
  </PageLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGarageStore } from '../stores/garage'
import PageLayout from '../components/PageLayout.vue'
import InfoSection from '../components/InfoSection.vue'
import DetailItem from '../components/DetailItem.vue'
import EmptyState from '../components/EmptyState.vue'
import ActionButton from '../components/ActionButton.vue'
import AppointmentItem from '../components/AppointmentItem.vue'

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