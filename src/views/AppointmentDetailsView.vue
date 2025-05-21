<template>
  <PageLayout title="">
    <div v-if="!appointment" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Rendez-vous non trouvé</h3>
      <p class="mt-1 text-sm text-gray-500">
        Le rendez-vous demandé n'existe pas ou n'est pas accessible.
      </p>
      <div class="mt-6">
        <router-link to="/appointments">
          <ActionButton>
            Retour à la liste des rendez-vous
          </ActionButton>
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
        <StatusBadge 
          :status="appointment.status" 
          :text="getStatusText(appointment.status)" 
        />
      </div>
      
      <!-- Informations principales -->
      <InfoSection 
        title="Informations générales" 
        description="Détails du rendez-vous"
      >
        <DetailItem label="Date et heure">
          {{ formatDate(appointment.appointmentDatetime) }}
        </DetailItem>
        
        <DetailItem label="Garage" :alternate="true">
          {{ getGarageName(appointment.garageId) }}
          <p v-if="garage" class="mt-1 text-sm text-gray-500">
            {{ garage.address }}, {{ garage.zipcode }} {{ garage.city }}
          </p>
        </DetailItem>
        
        <DetailItem label="Véhicule">
          {{ getVehicleInfo(appointment.vehicleId) }}
        </DetailItem>
        
        <DetailItem label="Statut" :alternate="true">
          <StatusBadge 
            :status="appointment.status" 
            :text="getStatusText(appointment.status)" 
          />
        </DetailItem>
        
        <DetailItem label="Notes">
          {{ appointment.notes || "Aucune note" }}
        </DetailItem>
      </InfoSection>
      
      <!-- Opérations -->
      <InfoSection 
        title="Opérations prévues" 
        description="Liste des interventions à effectuer"
      >
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
      </InfoSection>
      
      <!-- Actions -->
      <InfoSection title="Actions">
        <div class="px-4 py-5 sm:px-6">
          <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
            <router-link :to="`/appointment?vehicleId=${appointment.vehicleId}`">
              <ActionButton>
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Nouveau rendez-vous
              </ActionButton>
            </router-link>
            
            <ActionButton 
              v-if="appointment.status === 'pending'"
              @click="cancelAppointment"
              :loading="isUpdating"
              variant="secondary"
              class="!border-red-300 !text-red-700 hover:!bg-red-50 focus:!ring-red-500"
            >
              <svg v-if="!isUpdating" class="-ml-1 mr-2 h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ isUpdating ? 'Annulation en cours...' : 'Annuler le rendez-vous' }}
            </ActionButton>
          </div>
        </div>
      </InfoSection>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGarageStore } from '../stores/garage'

// Composants
import PageLayout from '../components/PageLayout.vue'
import InfoSection from '../components/InfoSection.vue'
import DetailItem from '../components/DetailItem.vue'
import StatusBadge from '../components/StatusBadge.vue'
import ActionButton from '../components/ActionButton.vue'

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