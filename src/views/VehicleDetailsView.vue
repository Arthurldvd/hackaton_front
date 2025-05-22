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
      
      <InfoSection 
        title="Opérations à venir" 
        description="Liste des opérations recommandées pour ce véhicule"
      >
        <div v-if="loading" class="p-6 text-center">
          <p class="text-gray-500">Chargement des opérations...</p>
        </div>
        
        <div v-else-if="loadError" class="p-6">
          <div class="rounded-md bg-red-50 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Erreur de chargement des opérations</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ errorMessage }}</p>
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    @click="fetchVehicleOperations"
                    class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="vehicleOperations.length === 0" class="p-6 text-center">
          <p class="text-gray-500">Aucune opération à venir pour ce véhicule</p>
        </div>
        
        <template v-else>
          <div class="px-4 py-3 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-gray-900">
                {{ vehicleOperations.length }} opération(s) recommandée(s)
              </div>
              <div class="flex space-x-4">
                <button 
                  @click="sortBy('date')" 
                  class="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Date limite
                  <svg v-if="sortKey === 'date'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-if="sortDirection === 'asc'" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-else />
                  </svg>
                </button>
                <button 
                  @click="sortBy('criticality')" 
                  class="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Criticité
                  <svg v-if="sortKey === 'criticality'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-if="sortDirection === 'asc'" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-else />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="(operation, index) in sortedOperations" :key="index" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-900">
                  {{ operation.label }}
                </div>
                <div 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="getCriticalityClasses(operation.criticality)"
                >
                  Priorité: {{ operation.criticality }}/9
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="text-sm text-gray-500">
                  <span class="font-medium">À effectuer dans:</span> {{ formatNextIn(operation.next_in_value, operation.next_in_unit) }}
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  {{ getDeadlineDate(operation.next_in_value, operation.next_in_unit) }}
                </div>
              </div>
            </li>
          </ul>
        </template>
      </InfoSection>
    </template>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGarageStore } from '../stores/garage'
import { vehicleService } from '../js/api'
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

const vehicleOperations = ref([])
const loading = ref(false)
const sortKey = ref('date')
const sortDirection = ref('asc')
const loadError = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  if (vehicle.value) {
    await fetchVehicleOperations()
  }
})

const fetchVehicleOperations = async () => {
  loading.value = true
  loadError.value = false
  errorMessage.value = ''
  
  const apiMethods = [
    vehicleService.getOperations,
    vehicleService.getOperationsAlt1,
    vehicleService.getOperationsAlt2
  ];
  
  let success = false;
  
  for (const apiMethod of apiMethods) {
    try {
      const response = await apiMethod(vehicleId)
      vehicleOperations.value = response.data.operations || []
      success = true;
      break;
    } catch (error) {
      console.error('Tentative échouée:', error);
    }
  }
  
  if (!success) {
    loadError.value = true;
    errorMessage.value = "Impossible de récupérer les opérations du véhicule. Vérifiez que l'API backend est correctement configurée.";
  }
  
  loading.value = false;
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const sortedOperations = computed(() => {
  const operations = [...vehicleOperations.value]
  
  if (sortKey.value === 'date') {
    operations.sort((a, b) => {
      const valueA = convertToCommonUnit(a.next_in_value, a.next_in_unit)
      const valueB = convertToCommonUnit(b.next_in_value, b.next_in_unit)
      return sortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    })
  } else if (sortKey.value === 'criticality') {
    operations.sort((a, b) => {
      return sortDirection.value === 'asc' 
        ? a.criticality - b.criticality 
        : b.criticality - a.criticality
    })
  }
  
  return operations
})

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
  
  return formatDate(deadline, false)
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

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return 'Non renseignée';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    if (withTime) {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
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