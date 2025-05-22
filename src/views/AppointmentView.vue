<template>
  <PageLayout title="Prendre rendez-vous">
    <div class="mb-8">
      <StepProgressBar :steps="steps" :current-step="currentStep" />
    </div>

    <FormError :message="errorMessage" />

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="currentStep === 0" class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner un véhicule</h2>

        <EmptyState
          v-if="userVehicles.length === 0"
          title="Aucun véhicule"
          description="Vous devez ajouter un véhicule avant de prendre rendez-vous."
        >
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

        <div v-else class="space-y-4">
          <SelectionItem
            v-for="vehicle in userVehicles" 
            :key="vehicle.id"
            :input-id="`vehicle-${vehicle.id}`"
            name="vehicle"
            :value="vehicle.id"
            v-model="form.vehicleId"
            :title="`${vehicle.brand} ${vehicle.model}`"
            :is-selected="selectedVehicle?.id === vehicle.id"
            @select="selectVehicle(vehicle)"
          >
            <div class="mt-1 flex flex-wrap gap-4">
              <div class="text-sm text-gray-500">
                Immatriculation: {{ vehicle.licensePlate }}
              </div>
              <div class="text-sm text-gray-500">
                Kilométrage: {{ vehicle.mileage.toLocaleString('fr-FR') }} km
              </div>
            </div>
          </SelectionItem>
        </div>

        <StepNavigation
          :show-back-button="false"
          :next-disabled="!form.vehicleId"
          @next="goToStep(1)"
        />
      </div>

      <div v-if="currentStep === 1" class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner un garage</h2>

        <EmptyState
          v-if="!garages || garages.length === 0"
          title="Aucun garage disponible"
          description="Impossible de charger la liste des garages."
        >
        </EmptyState>

        <div v-else>
          <div class="mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="text" 
                v-model="garageSearchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher un garage par nom ou ville..." 
                @input="filterGarages"
              />
            </div>
          </div>

          <div v-if="filteredGarages.length === 0" class="text-center py-8">
            <p class="text-gray-500">Aucun garage ne correspond à votre recherche</p>
          </div>
          
          <div v-else>
            <div class="space-y-4 mb-6">
              <SelectionItem
                v-for="garage in displayedGarages" 
                :key="garage.id"
                :input-id="`garage-${garage.id}`"
                name="garage"
                :value="garage.id"
                v-model="form.garageId"
                :title="garage.name"
                :is-selected="form.garageId === garage.id"
                @select="selectGarage(garage.id)"
              >
                <div class="mt-1 text-sm text-gray-500">
                  {{ garage.city }}, {{ garage.postalCode || garage.postal_code }}
                </div>
              </SelectionItem>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-2 py-3 sm:px-6">
              <div class="flex flex-1 justify-between sm:hidden">
                <button
                  @click="currentPage > 1 ? currentPage-- : null"
                  :disabled="currentPage === 1"
                  :class="[
                    'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  ]"
                >
                  Précédent
                </button>
                <button
                  @click="currentPage < totalPages ? currentPage++ : null"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700',
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  ]"
                >
                  Suivant
                </button>
              </div>
              
              <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Affichage 
                    <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                    à
                    <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredGarages.length) }}</span>
                    sur
                    <span class="font-medium">{{ filteredGarages.length }}</span>
                    garages
                  </p>
                </div>
                
                <div>
                  <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      @click="currentPage > 1 ? currentPage-- : null"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                      :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                    >
                      <span class="sr-only">Précédent</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    
                    <button 
                      v-for="page in Math.min(5, totalPages)" 
                      :key="page"
                      @click="currentPage = page"
                      :class="[
                        'relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium focus:z-20',
                        currentPage === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    
                    <div v-if="totalPages > 5 && currentPage < totalPages - 2" class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                      ...
                    </div>
                    
                    <button 
                      v-if="totalPages > 5 && currentPage < totalPages - 1"
                      @click="currentPage = totalPages"
                      class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    >
                      {{ totalPages }}
                    </button>
                    
                    <button
                      @click="currentPage < totalPages ? currentPage++ : null"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                      :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                    >
                      <span class="sr-only">Suivant</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StepNavigation
          :next-disabled="!form.garageId"
          @back="goToStep(0)"
          @next="goToStep(2)"
        />
      </div>

      <div v-if="currentStep === 2" class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner les opérations</h2>

        <EmptyState
          v-if="!operationCategories || operationCategories.length === 0 || garageStore.operations.length === 0"
          title="Aucune prestation disponible"
          description="Impossible de charger la liste des prestations."
        >
        </EmptyState>

        <div v-else class="mt-4 space-y-6">
          <OperationCategory
            v-for="category in operationCategories"
            :key="category.id"
            :title="category.name"
          >
            <p v-if="getOperationsByCategory(category.id).length === 0" class="text-sm text-gray-500 py-2">
              Aucune prestation disponible dans cette catégorie
            </p>
            <OperationItem
              v-for="operation in getOperationsByCategory(category.id)"
              :key="operation.id"
              :input-id="`operation-${operation.id}`"
              :value="operation.id"
              v-model="form.operations"
              :name="operation.name"
              :formatted-price="formatPrice(operation.price)"
              :additional-help="operation.additionalHelp"
              :additional-comment="operation.additionalComment"
            />
          </OperationCategory>
        </div>

        <SummarySection v-if="form.operations.length > 0" title="Opérations sélectionnées">
          <SummaryItem
            v-for="operationId in form.operations"
            :key="operationId"
            :label="garageStore.operations.find(op => op.id === operationId)?.name || 'Opération'"
            :value="formatPrice(parseFloat(garageStore.operations.find(op => op.id === operationId)?.price || 0))"
          />
          <SummaryItem
            label="Total"
            :value="formatPrice(calculateTotal())"
            is-total
          />
        </SummarySection>

        <StepNavigation
          :next-disabled="form.operations.length === 0"
          @back="goToStep(1)"
          @next="goToStep(3)"
        />
      </div>

      <div v-if="currentStep === 3" class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner une date et un créneau</h2>

        <div class="mb-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Disponibilités pour le garage sélectionné
            </label>
            <div v-if="isLoadingTimeSlots" class="flex items-center justify-center py-6">
              <svg class="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2 text-gray-600">Chargement des disponibilités...</span>
            </div>
            <div v-else-if="availableDates.length === 0" class="py-4 text-center bg-gray-50 rounded-md">
              <p class="text-gray-500">Aucune disponibilité pour ce garage</p>
              <p class="text-sm text-gray-500 mt-1">Veuillez sélectionner un autre garage ou revenir plus tard</p>
            </div>
            <div v-else class="grid grid-cols-7 gap-2">
              <div 
                v-for="(date, index) in availableDates" 
                :key="index"
                @click="selectAvailableDate(date)"
                :class="[
                  'p-2 text-center cursor-pointer rounded-md border transition-colors duration-200',
                  selectedDate === date ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                ]"
              >
                {{ formatDate(date) }}
              </div>
            </div>
          </div>
          
          <div v-if="selectedDate" class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-md font-medium text-gray-900">Créneaux disponibles pour le {{ formatDateLong(selectedDate) }}</h3>
              <div>
                <select 
                  v-model="sortOrder" 
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="asc">Matin d'abord</option>
                  <option value="desc">Après-midi d'abord</option>
                </select>
              </div>
            </div>
            
            <TimeSlotGrid
              v-if="filteredTimeSlots.length > 0"
              class="mb-6"
            >
              <TimeSlotItem
                v-for="(slot, index) in filteredTimeSlots"
                :key="index"
                :text="formatTimeSlot(slot.start)"
                :is-selected="form.timeSlot === slot"
                @select="selectTimeSlot(slot)"
              />
            </TimeSlotGrid>
            
            <div v-else class="mb-6 text-center py-4 bg-gray-50 rounded-md">
              <p class="text-gray-500">Aucun créneau disponible à cette date</p>
              <p class="text-sm text-gray-500 mt-1">Veuillez sélectionner une autre date</p>
            </div>
          </div>
        </div>

        <SummarySection v-if="form.timeSlot" title="Récapitulatif">
          <SummaryItem
            label="Véhicule"
            :value="getVehicleInfo(form.vehicleId)"
          />
          <SummaryItem
            label="Garage"
            :value="getGarageName(form.garageId)"
          />
          <SummaryItem
            label="Date et heure"
            :value="formatTimeSlot(form.timeSlot.start, true)"
          />
          <SummaryItem
            label="Durée estimée"
            :value="`${Math.round(form.timeSlot.duration / 60 * 10) / 10} heure(s)`"
          />
          <SummaryItem
            label="Total"
            :value="formatPrice(calculateTotal())"
            is-total
          />
        </SummarySection>

        <StepNavigation @back="goToStep(2)">
          <template #next>
            <ActionButton
              :disabled="!isFormValid || isSubmitting"
              :loading="isSubmitting"
              @click="submitAppointment"
            >
              {{ isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation' }}
            </ActionButton>
          </template>
        </StepNavigation>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import { vehicleService, garageService, operationService, appointmentService } from '../js/api'

import PageLayout from '../components/PageLayout.vue'
import StepProgressBar from '../components/StepProgressBar.vue'
import FormError from '../components/FormError.vue'
import EmptyState from '../components/EmptyState.vue'
import ActionButton from '../components/ActionButton.vue'
import SelectionItem from '../components/SelectionItem.vue'
import StepNavigation from '../components/StepNavigation.vue'
import OperationCategory from '../components/OperationCategory.vue'
import OperationItem from '../components/OperationItem.vue'
import SummarySection from '../components/SummarySection.vue'
import SummaryItem from '../components/SummaryItem.vue'
import FormInput from '../components/FormInput.vue'
import TimeSlotGrid from '../components/TimeSlotGrid.vue'
import TimeSlotItem from '../components/TimeSlotItem.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const garageStore = useGarageStore()

const garages = ref([])
const filteredGarages = ref([])
const garageSearchQuery = ref('')
const operationCategories = ref([])
const operationCache = ref({}) // Ajout de cette ligne pour résoudre l'erreur

// Disponibilités des rendez-vous
const availableDates = ref([])
const selectedDate = ref('')
const isLoadingTimeSlots = ref(false)

// Pagination pour les garages
const currentPage = ref(1)
const pageSize = ref(6) // Nombre de garages par page
const totalPages = computed(() => Math.ceil(filteredGarages.value.length / pageSize.value))
const displayedGarages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGarages.value.slice(start, end)
})

// Tri des créneaux horaires
const sortOrder = ref('asc')
const filteredTimeSlots = computed(() => {
  if (!availableTimeSlots.value || availableTimeSlots.value.length === 0) return [];
  
  // Filtrer les créneaux pour la date sélectionnée
  const slotsForDate = availableTimeSlots.value.filter(slot => {
    if (!slot.start) return false;
    const slotDate = new Date(slot.start).toISOString().split('T')[0];
    return slotDate === selectedDate.value;
  });
  
  // Trier les créneaux par heure
  return [...slotsForDate].sort((a, b) => {
    if (!a.start || !b.start) return 0;
    const timeA = new Date(a.start).getHours() * 60 + new Date(a.start).getMinutes();
    const timeB = new Date(b.start).getHours() * 60 + new Date(b.start).getMinutes();
    return sortOrder.value === 'asc' ? timeA - timeB : timeB - timeA;
  });
})

const steps = [
  { id: 'step-1', name: 'Véhicule' },
  { id: 'step-2', name: 'Garage' },
  { id: 'step-3', name: 'Opérations' },
  { id: 'step-4', name: 'Date et heure' }
]

const currentStep = ref(0)
const errorMessage = ref('')
const isSubmitting = ref(false)

const form = ref({
  vehicleId: '',
  garageId: '',
  operations: [],
  date: '',
  timeSlot: null
})

const selectedVehicle = computed(() => {
  return userVehicles.value.find(v => v.id === form.value.vehicleId) || null
})

const userVehicles = computed(() => {
  return garageStore.getVehiclesByClientId(authStore.user.id)
})

const availableTimeSlots = ref([])

const isFormValid = computed(() => {
  return (
    form.value.vehicleId &&
    form.value.garageId &&
    form.value.operations.length > 0 &&
    form.value.date &&
    form.value.timeSlot
  )
})

const minDate = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() + 1)
  return today.toISOString().split('T')[0]
})

onMounted(async () => {
  try {
    // Chargement des données nécessaires
    await garageStore.fetchGarages();
    await garageStore.fetchCategories(); // Récupérer d'abord les catégories
    await garageStore.fetchOperations(); // Ensuite les opérations
    await garageStore.fetchVehicles();
    
    garages.value = garageStore.garages;
    filteredGarages.value = garages.value;
    
    // Si les garages sont toujours vides après la récupération, on force un rechargement
    if (garages.value.length === 0 && garageStore.garages.length === 0) {
      await garageStore.fetchGarages();
      garages.value = garageStore.garages;
      filteredGarages.value = garages.value;
    }
    
    operationCategories.value = garageStore.operationCategories;
    
    // Mettre en cache les opérations pour un accès facile
    garageStore.operations.forEach(op => {
      operationCache.value[op.id] = op;
    });

    const vehicleId = route.query.vehicleId;
    const garageId = route.query.garageId;

    if (vehicleId) form.value.vehicleId = vehicleId;
    if (garageId) form.value.garageId = garageId;
    if (vehicleId && garageId) currentStep.value = 2;
  } catch (e) {
    errorMessage.value = 'Impossible de charger les données.';
    console.error(e);
  }
});

// Récupérer les disponibilités quand on passe à l'étape 3
watch(() => currentStep.value, async (step) => {
  if (step === 3 && form.value.garageId) {
    await fetchAvailabilities();
  }
});

// Fonction pour récupérer les disponibilités du garage sélectionné
const fetchAvailabilities = async () => {
  try {
    isLoadingTimeSlots.value = true;
    errorMessage.value = '';
    form.value.date = null;
    form.value.timeSlot = null;
    selectedDate.value = '';
    availableDates.value = [];
    availableTimeSlots.value = [];
    
    // Récupérer tous les créneaux disponibles pour ce garage
    const response = await garageStore.generateTimeSlots(
      form.value.garageId,
      null, // On envoie null pour avoir toutes les dates disponibles
      form.value.operations
    );
    
    // Traiter le format de réponse: [{date: "2025-05-21", slots: ["14:00", "08:00"]}, ...]
    const formattedTimeSlots = [];
    
    // Vérifier si la réponse est un tableau
    if (Array.isArray(response)) {
      response.forEach(dateItem => {
        const dateStr = dateItem.date;
        
        // Pour chaque slot dans la journée, créer un objet de créneau formaté
        if (Array.isArray(dateItem.slots)) {
          dateItem.slots.forEach(timeStr => {
            // Créer une date complète à partir de la date et de l'heure
            const [hours, minutes] = timeStr.split(':');
            const dateObj = new Date(dateStr);
            dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            
            formattedTimeSlots.push({
              start: dateObj.toISOString(),
              end: new Date(dateObj.getTime() + 60 * 60 * 1000).toISOString(), // +1 heure
              duration: 60 * 60, // 1 heure en secondes
            });
          });
        }
      });
      
      availableTimeSlots.value = formattedTimeSlots;
      
      // Extraire les dates uniques
      availableDates.value = response.map(item => item.date).sort();
      
      // Sélectionner automatiquement la première date si disponible
      if (availableDates.value.length > 0) {
        selectAvailableDate(availableDates.value[0]);
      }
    }
    
  } catch (e) {
    errorMessage.value = 'Erreur de chargement des disponibilités.';
    console.error(e);
  } finally {
    isLoadingTimeSlots.value = false;
  }
};

// Fonction pour sélectionner une date disponible
const selectAvailableDate = (date) => {
  selectedDate.value = date;
  form.value.date = date;
  form.value.timeSlot = null;
};

const getOperationsByCategory = (categoryId) => {
  // Utiliser directement le getter du store qui filtre les opérations par catégorie
  return garageStore.operations.filter(op => op.category === categoryId);
}



const filterGarages = () => {
  if (!garageSearchQuery.value.trim()) {
    filteredGarages.value = garages.value;
  } else {
    const query = garageSearchQuery.value.toLowerCase().trim();
    filteredGarages.value = garages.value.filter(garage => {
      return (
        garage.name.toLowerCase().includes(query) || 
        (garage.city && garage.city.toLowerCase().includes(query)) ||
        (garage.postalCode && garage.postalCode.toLowerCase().includes(query)) ||
        (garage.postal_code && garage.postal_code.toLowerCase().includes(query))
      );
    });
  }
  
  // Réinitialiser la pagination à la première page quand on filtre
  currentPage.value = 1;
}

const selectVehicle = (vehicle) => {
  form.value.vehicleId = vehicle.id
}

const selectGarage = (garageId) => {
  form.value.garageId = garageId
}

const selectTimeSlot = (slot) => {
  form.value.timeSlot = slot
}

const calculateTotal = () => {
  let total = 0;
  form.value.operations.forEach((operationId) => {
    const operation = garageStore.operations.find(op => op.id === operationId);
    if (operation) {
      total += parseFloat(operation.price || 0);
    }
  });
  return total;
}

const formatPrice = (price) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(numericPrice)
}

const formatTimeSlot = (dateTimeString, withDate = false) => {
  const date = new Date(dateTimeString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: withDate ? 'numeric' : undefined,
    month: withDate ? 'long' : undefined,
    year: withDate ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'numeric'
  }).format(date);
}

const formatDateLong = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

const getVehicleInfo = (vehicleId) => {
  const vehicle = garageStore.vehicles.find(v => v.id === vehicleId);
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})` : 'Inconnu';
};

const getGarageName = (garageId) => {
  const garage = garages.value.find(g => g.id === garageId)
  return garage ? garage.name : 'Inconnu'
}

const goToStep = (step) => {
  errorMessage.value = ''
  if (step > currentStep.value) {
    if (currentStep.value === 0 && !form.value.vehicleId) {
      return (errorMessage.value = 'Sélectionnez un véhicule')
    }
    if (currentStep.value === 1 && !form.value.garageId) {
      return (errorMessage.value = 'Sélectionnez un garage')
    }
    if (currentStep.value === 2 && form.value.operations.length === 0) {
      return (errorMessage.value = 'Sélectionnez au moins une opération')
    }
  }
  currentStep.value = step
}

const submitAppointment = async () => {
  try {
    isSubmitting.value = true;
    if (!isFormValid.value) return (errorMessage.value = 'Formulaire incomplet');
    
    const appointmentData = {
      date: form.value.timeSlot.start,
      status: 'scheduled',
      notes: '',
      vehicule_id: form.value.vehicleId,
      garage_id: form.value.garageId,
      operations: form.value.operations
    };
    
    const response = await garageStore.createAppointment(appointmentData);
    router.push(`/appointments`);
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Erreur lors de la réservation';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
