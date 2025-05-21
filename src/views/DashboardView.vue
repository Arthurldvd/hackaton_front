<template>
  <PageLayout title="Tableau de bord">
    <p class="mt-2 text-gray-600">Bienvenue, {{ user.firstName }} {{ user.lastName }}</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Carte Véhicules -->
      <DashboardCard title="Vos véhicules" color="indigo">
        <template #badge>
          <CountBadge :count="vehicles.length" color="indigo" />
        </template>
        
        <ul v-if="vehicles.length > 0" class="divide-y divide-gray-200">
          <DashboardListItem 
            v-for="vehicle in vehicles" 
            :key="vehicle.id"
            :title="`${vehicle.brand} ${vehicle.model}`"
            :link="`/vehicles/${vehicle.id}`"
            color="indigo"
          >
            <p class="text-sm text-gray-500">{{ vehicle.licensePlate }}</p>
          </DashboardListItem>
        </ul>
        
        <EmptyState v-else message="Aucun véhicule enregistré" simple />
        
        <template #footer>
          <router-link to="/vehicles/add">
            <ActionButton>
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un véhicule
            </ActionButton>
          </router-link>
        </template>
      </DashboardCard>
      
      <!-- Carte Rendez-vous -->
      <DashboardCard title="Rendez-vous à venir" color="green">
        <template #badge>
          <CountBadge :count="pendingAppointments.length" color="green" />
        </template>
        
        <ul v-if="pendingAppointments.length > 0" class="divide-y divide-gray-200">
          <DashboardListItem 
            v-for="appointment in pendingAppointments" 
            :key="appointment.id"
            :title="formatDate(appointment.appointmentDatetime)"
            :link="`/appointments/${appointment.id}`"
            color="green"
          >
            <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicleId) }}</p>
            <p class="text-sm text-gray-500">{{ getGarageName(appointment.garageId) }}</p>
          </DashboardListItem>
        </ul>
        
        <EmptyState v-else message="Aucun rendez-vous à venir" simple />
        
        <template #footer>
          <router-link to="/appointment">
            <ActionButton color="green">
              <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Prendre rendez-vous
            </ActionButton>
          </router-link>
        </template>
      </DashboardCard>
      
      <!-- Carte Historique -->
      <DashboardCard title="Historique" color="gray">
        <ul v-if="completedAppointments.length > 0" class="divide-y divide-gray-200">
          <DashboardListItem 
            v-for="appointment in completedAppointments" 
            :key="appointment.id"
            :title="formatDate(appointment.appointmentDatetime)"
            :link="`/appointments/${appointment.id}`"
            color="gray"
          >
            <p class="text-sm text-gray-500">{{ getVehicleName(appointment.vehicleId) }}</p>
            <p class="text-sm text-gray-500">{{ getGarageName(appointment.garageId) }}</p>
          </DashboardListItem>
        </ul>
        
        <EmptyState v-else message="Aucun rendez-vous passé" simple />
        
        <template #footer>
          <router-link to="/appointments" class="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
            <span>Voir tout l'historique</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </template>
      </DashboardCard>
    </div>
    
    <!-- Garages à proximité -->
    <InfoSection title="Garages à proximité">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GarageCard
          v-for="garage in garages.slice(0, 3)"
          :key="garage.id"
          :name="garage.name"
          :address="garage.address"
          :city="garage.city"
          :postal-code="garage.postal_code"
        >
          <router-link
            :to="`/appointment?garageId=${garage.id}`"
            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
          >
            <span>Prendre rendez-vous</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </GarageCard>
      </div>
    </InfoSection>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import client from '@/js/client'

// Composants
import PageLayout from '../components/PageLayout.vue'
import DashboardCard from '../components/DashboardCard.vue'
import CountBadge from '../components/CountBadge.vue'
import DashboardListItem from '../components/DashboardListItem.vue'
import EmptyState from '../components/EmptyState.vue'
import ActionButton from '../components/ActionButton.vue'
import InfoSection from '../components/InfoSection.vue'
import GarageCard from '../components/GarageCard.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 🔁 Remplace les mock data par un fetch réel
const garages = ref([])

onMounted(async () => {
  try {
    const response = await client.get('/garages')
    garages.value = response.garages || []
  } catch (error) {
    console.error('Erreur lors du chargement des garages:', error.message)
  }
})

// ⚙️ Ces parties restent inchangées
const vehicles = computed(() => {
  // À adapter si tu as une source réelle
  return [] // temporaire si garageStore n'est plus utilisé
})

const appointments = computed(() => {
  return vehicles.value.flatMap(vehicle => []) // idem
})

const pendingAppointments = computed(() => {
  return appointments.value
    .filter(appointment => ['pending', 'confirmed'].includes(appointment.status))
    .sort((a, b) => new Date(a.appointmentDatetime) - new Date(b.appointmentDatetime))
    .slice(0, 3)
})

const completedAppointments = computed(() => {
  return appointments.value
    .filter(appointment => appointment.status === 'completed')
    .sort((a, b) => new Date(b.appointmentDatetime) - new Date(a.appointmentDatetime))
    .slice(0, 3)
})

// 🧠 Formatage et affichage
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

const getVehicleName = (vehicleId) => 'Véhicule inconnu'
const getGarageName = (garageId) => {
  const garage = garages.value.find(g => g.id === garageId)
  return garage ? garage.name : 'Garage inconnu'
}
</script>