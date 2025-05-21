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

        <div class="space-y-4">
          <SelectionItem
            v-for="garage in garages" 
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
              {{ garage.city }}, {{ garage.postal_code }}
            </div>
          </SelectionItem>
        </div>

        <StepNavigation
          :next-disabled="!form.garageId"
          @back="goToStep(0)"
          @next="goToStep(2)"
        />
      </div>

      <div v-if="currentStep === 2" class="p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner les opérations</h2>

        <div class="mt-4 space-y-6">
          <OperationCategory
            v-for="category in operationCategories"
            :key="category.id"
            :title="category.name"
          >
            <OperationItem
              v-for="operation in getOperationsByCategory(category.id)"
              :key="operation.id"
              :input-id="`operation-${operation.id}`"
              :value="operation.id"
              v-model="form.operations"
              :name="getOperationName(operation.id)"
              :formatted-price="formatPrice(getOperationPrice(operation.id))"
              :additional-help="operation.additionalHelp"
              :additional-comment="operation.additionalComment"
            />
          </OperationCategory>
        </div>

        <SummarySection v-if="form.operations.length > 0" title="Opérations sélectionnées">
          <SummaryItem
            v-for="operationId in form.operations"
            :key="operationId"
            :label="getOperationName(operationId)"
            :value="formatPrice(getOperationPrice(operationId))"
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
          <FormInput
            v-model="form.date"
            label="Date souhaitée"
            name="appointment-date"
            id="appointment-date"
            type="date"
            :min="minDate"
          />
        </div>

        <TimeSlotGrid
          v-if="form.date && availableTimeSlots.length > 0"
          title="Créneaux disponibles"
          class="mb-6"
        >
          <TimeSlotItem
            v-for="(slot, index) in availableTimeSlots"
            :key="index"
            :text="formatTimeSlot(slot.start)"
            :is-selected="form.timeSlot === slot"
            @select="selectTimeSlot(slot)"
          />
        </TimeSlotGrid>

        <div v-else-if="form.date" class="mb-6 text-center py-4 bg-gray-50 rounded-md">
          <p class="text-gray-500">Aucun créneau disponible à cette date</p>
          <p class="text-sm text-gray-500 mt-1">Veuillez sélectionner une autre date</p>
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
import client from '@/js/client'

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
const operationCategories = ref([])
const operationCache = ref({}) 

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
    const garagesResponse = await client.get('/garages')
    garages.value = garagesResponse.garages || []

    const categoriesResponse = await client.get('/operations/category')
    const categories = categoriesResponse || []

    const categoriesWithOps = await Promise.all(categories.map(async (cat) => {
      try {
        const ops = await client.get(`/operations/${cat.id}`)
        for (const op of ops) {
          operationCache.value[op.id] = op
        }
        return { ...cat, operations: ops }
      } catch (e) {
        console.error(`Erreur chargement opérations pour catégorie ${cat.id}`, e)
        return { ...cat, operations: [] }
      }
    }))
    operationCategories.value = categoriesWithOps

  } catch (e) {
    errorMessage.value = 'Impossible de charger les données.'
    console.error(e)
  }

  const vehicleId = route.query.vehicleId
  const garageId = route.query.garageId

  if (vehicleId) form.value.vehicleId = vehicleId
  if (garageId) form.value.garageId = garageId
  if (vehicleId && garageId) currentStep.value = 2
})

watch(() => form.value.date, async (newDate) => {
  if (!newDate) return (availableTimeSlots.value = [])
  try {
    form.value.timeSlot = null
    availableTimeSlots.value = garageStore.generateTimeSlots(
      form.value.garageId,
      newDate,
      form.value.operations
    )
  } catch (e) {
    errorMessage.value = 'Erreur de chargement des créneaux.'
  }
})

const getOperationsByCategory = (categoryId) => {
  return operationCategories.value.find(c => c.id === categoryId)?.operations || []
}

const getOperationName = (operationId) => {
  return operationCache.value[operationId]?.name || 'Chargement...'
}

const getOperationPrice = (operationId) => {
  const price = parseFloat(operationCache.value[operationId]?.price || 0)
  console.log(`Operation ID: ${operationId}, Price: ${price}`)
  return price
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
  form.value.operations.forEach((id) => {
    const price = getOperationPrice(id);
    console.log(`Operation ID: ${id}, Price: ${price}`);
    total += price;
  });
  console.log(`Total: ${total}`);
  return total;
}


const formatPrice = (price) => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  console.log(`Formatting price: ${numericPrice}`)
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

const getVehicleInfo = (vehicleId) => {
  const vehicle = garageStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Inconnu'
}

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
    isSubmitting.value = true
    if (!isFormValid.value) return (errorMessage.value = 'Formulaire incomplet')
    const data = {
      vehicleId: form.value.vehicleId,
      garageId: form.value.garageId,
      appointmentDatetime: form.value.timeSlot.start,
      notes: ''
    }
    const newAppointment = garageStore.createAppointment(data, form.value.operations)
    router.push(`/appointments/${newAppointment.id}`)
  } catch (e) {
    errorMessage.value = 'Erreur lors de la réservation'
  } finally {
    isSubmitting.value = false
  }
}
</script>
