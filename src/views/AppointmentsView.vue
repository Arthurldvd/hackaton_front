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
          :formatted-date="formatDate(appointment.date)"
          :garage-name="getGarageNameForAppointment(appointment)"
          :vehicle-name="getVehicleNameForAppointment(appointment)"
          :operations-summary="getOperationsSummary(appointment.id)"
          :status-text="getStatusText(appointment.status)"
          :status-classes="getStatusClasses(appointment.status)"
        >
        </AppointmentItem>
      </ul>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
  
  if (Array.isArray(garageStore.appointments)) {
    
    if (garageStore.appointments.length > 0) {
    }
  }
  
  // Si nous avons encore une structure imbriquée, prenons le premier niveau
  if (Array.isArray(garageStore.appointments) && 
      garageStore.appointments.length > 0 && 
      Array.isArray(garageStore.appointments[0])) {
    return garageStore.appointments[0];
  }
  
  return garageStore.appointments;
})

const filteredAppointments = computed(() => {
  
  let result;
  if (statusFilter.value === 'all') {
    result = appointments.value.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    result = appointments.value
      .filter(appointment => appointment.status === statusFilter.value)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  
  // Afficher les détails du premier rendez-vous pour comprendre sa structure
  if (result.length > 0) {
    const firstAppointment = result[0];
    
    // Vérifions si on a des propriétés cachées
    for (const key in firstAppointment) {
    }
  }
  
  return result;
})

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  
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
    console.error("Erreur de formatage de date:", error, "pour la valeur:", dateString);
    return 'Erreur de date';
  }
}

const getGarageName = (garageId) => {
  if (!garageId) {
    
    // Si les rendez-vous ont des objets garage imbriqués, essayons de les utiliser
    const firstAppointment = appointments.value[0];
    if (firstAppointment && firstAppointment.garage) {
      return firstAppointment.garage.name || 'Garage sans nom';
    }
    
    return 'Garage non défini';
  }
  
  
  // Essayez différentes propriétés pour les garages
  const garage = garageStore.garages.find(g => {
    return g.id === garageId || g.id === parseInt(garageId) || g.garage_id === garageId;
  });
  
  if (garage) {
    return garage.name;
  } else {
    return 'Garage inconnu';
  }
}

const getVehicleName = (vehicleId) => {
  if (!vehicleId) {
    
    // Si les rendez-vous ont des objets vehicule imbriqués, essayons de les utiliser
    const firstAppointment = appointments.value[0];
    if (firstAppointment && firstAppointment.vehicule) {
      return `${firstAppointment.vehicule.brand || ''} ${firstAppointment.vehicule.model || ''}`.trim() || 'Véhicule sans détails';
    }
    
    return 'Véhicule non défini';
  }
  
  
  // Essayez différentes propriétés pour les véhicules
  const vehicle = garageStore.vehicles.find(v => {
    return v.id === vehicleId || v.id === parseInt(vehicleId) || v.vehicule_id === vehicleId;
  });
  
  if (vehicle) {
    return `${vehicle.brand} ${vehicle.model}`;
  } else {
    return 'Véhicule inconnu';
  }
}

const getOperationsSummary = (appointmentId) => {
  if (!appointmentId) return "Aucune opération";
  
  try {
    // Chercher le rendez-vous dans la liste
    const appointment = appointments.value.find(a => a.id === appointmentId);
    
    // Vérifier si le rendez-vous contient directement des opérations
    if (appointment && appointment.operations) {
      
      if (Array.isArray(appointment.operations) && appointment.operations.length > 0) {
        if (appointment.operations.length === 1) {
          // Si c'est un objet avec un nom
          if (typeof appointment.operations[0] === 'object' && appointment.operations[0].name) {
            return appointment.operations[0].name;
          }
          // Si c'est juste un ID
          return "1 opération";
        }
        return `${appointment.operations.length} opérations`;
      }
      
      return "Aucune opération";
    }
    
    // Vérifier si la fonction existe dans le store
    if (!garageStore.getOperationsByAppointmentId) {
      return "Opérations non disponibles";
    }
    
    const operations = garageStore.getOperationsByAppointmentId(appointmentId);
    
    if (!operations || operations.length === 0) {
      return "Aucune opération";
    }
    
    if (operations.length === 1) {
      return operations[0].name;
    }
    
    return `${operations[0].name} + ${operations.length - 1} autre(s)`;
  } catch (error) {
    console.error("Erreur lors de la récupération des opérations:", error);
    return "Erreur";
  }
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

const getGarageNameForAppointment = (appointment) => {

  if (appointment.garage) {
    return getGarageName(appointment.garage.id);
  }
  return 'Garage non spécifié';
}

const getVehicleNameForAppointment = (appointment) => {
 
  if (appointment.vehicule) {
    return getVehicleName(appointment.vehicule.id);
  }
  
  return 'Véhicule non spécifié';
}

const loadAppointments = async () => {
  isLoading.value = true
  
  try {
    // Charger toutes les données nécessaires
    await Promise.all([
      garageStore.fetchGarages(),
      garageStore.fetchVehicles(),
      garageStore.fetchOperations(),
      garageStore.fetchAppointmentsByUser()
    ])
    
    
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
  } finally {
    isLoading.value = false
  }
}

// Surveiller les rendez-vous pour afficher plus de détails quand ils sont chargés
watch(appointments, (newAppointments) => {
  
  if (newAppointments && newAppointments.length > 0) {
    const firstAppointment = newAppointments[0];
    
    // Afficher toutes les propriétés du premier rendez-vous
    for (const key in firstAppointment) {
    }
  }
}, { immediate: true });

onMounted(() => {
  loadAppointments()
})
</script> 