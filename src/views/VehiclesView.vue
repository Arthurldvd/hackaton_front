<template>
  <PageLayout title="Mes véhicules">
    <template #header-actions>
      <router-link to="/vehicles/add">
        <ActionButton>
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un véhicule
        </ActionButton>
      </router-link>
    </template>
    
    <EmptyState 
      v-if="vehicles.length === 0" 
      title="Aucun véhicule"
      description="Commencez par ajouter un véhicule pour prendre rendez-vous."
    >
      <template #icon>
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </template>
      
      <template #action>
        <router-link to="/vehicles/add">
          <ActionButton>
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un véhicule
          </ActionButton>
        </router-link>
      </template>
    </EmptyState>
    
    <ul v-else role="list" class="divide-y divide-gray-200">
      <VehicleItem
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        :vehicle="vehicle"
        :formatted-registration-date="formatDate(vehicle.registrationDate)"
      >
        <template #actions>
          <router-link 
            :to="`/vehicles/${vehicle.id}`" 
            class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            Détails
          </router-link>
          
          <router-link 
            :to="`/appointment?vehicleId=${vehicle.id}`" 
            class="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            Prendre RDV
          </router-link>
        </template>
      </VehicleItem>
    </ul>
  </PageLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import PageLayout from '../components/PageLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import ActionButton from '../components/ActionButton.vue'
import VehicleItem from '../components/VehicleItem.vue'

const authStore = useAuthStore()
const garageStore = useGarageStore()

const vehicles = computed(() => {
  return garageStore.getVehiclesByClientId(authStore.user.id)
})

const formatDate = (dateString) => {
  if (!dateString) return 'Non renseignée';
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
}
</script> 