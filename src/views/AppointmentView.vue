<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Prendre rendez-vous</h1>
      </div>

      <!-- Indicateur de progression -->
      <div class="mb-8">
        <nav aria-label="Progress">
          <ol role="list" class="flex items-center">
            <li v-for="(step, index) in steps" :key="step.id" :class="[index !== 0 ? 'ml-8 sm:ml-16' : '', 'relative']">
              <div v-if="index !== 0" class="absolute inset-0 flex items-center" aria-hidden="true">
                <div :class="[currentStep > index ? 'bg-indigo-600' : 'bg-gray-200', 'h-0.5 w-full']"></div>
              </div>
              <div :class="[
                currentStep > index ? 'bg-indigo-600' : currentStep === index ? 'bg-indigo-600' : 'bg-gray-200',
                'relative flex h-8 w-8 items-center justify-center rounded-full'
              ]">
                <svg v-if="currentStep > index" class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span v-else :class="[currentStep === index ? 'text-white' : 'text-gray-500', 'text-sm font-medium']">
                  {{ index + 1 }}
                </span>
              </div>
              <div class="relative ml-4 mt-2">
                <span :class="[currentStep >= index ? 'text-indigo-600' : 'text-gray-500', 'text-sm font-medium']">
                  {{ step.name }}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div v-if="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <!-- Étape 1 : Sélection du véhicule -->
        <div v-if="currentStep === 0" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner un véhicule</h2>

          <div v-if="userVehicles.length === 0" class="text-center py-6">
            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun véhicule</h3>
            <p class="mt-1 text-sm text-gray-500">
              Vous devez ajouter un véhicule avant de prendre rendez-vous.
            </p>
            <div class="mt-6">
              <router-link
                to="/vehicles/add"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un véhicule
              </router-link>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div v-for="vehicle in userVehicles" :key="vehicle.id"
              class="border rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': selectedVehicle?.id === vehicle.id }"
              @click="selectVehicle(vehicle)"
            >
              <div class="flex items-center">
                <div>
                  <input
                    type="radio"
                    :id="`vehicle-${vehicle.id}`"
                    name="vehicle"
                    :value="vehicle.id"
                    v-model="form.vehicleId"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                </div>
                <div class="ml-3 flex-1">
                  <label :for="`vehicle-${vehicle.id}`" class="text-lg font-medium text-gray-900 block">
                    {{ vehicle.brand }} {{ vehicle.model }}
                  </label>
                  <div class="mt-1 flex flex-wrap gap-4">
                    <div class="text-sm text-gray-500">
                      Immatriculation: {{ vehicle.licensePlate }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Kilométrage: {{ vehicle.mileage.toLocaleString('fr-FR') }} km
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="button"
              @click="goToStep(1)"
              :disabled="!form.vehicleId"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
              <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Étape 2 : Sélection du garage -->
        <div v-if="currentStep === 1" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner un garage</h2>

          <div class="space-y-4">
            <div v-for="garage in garages" :key="garage.id"
            class="border rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              :class="{ 'border-indigo-500 bg-indigo-50': form.garageId === garage.id }"
              @click="selectGarage(garage.id)"
            >
              <div class="flex items-center">
                <div>
                  <input
                    type="radio"
                    :id="`garage-${garage.id}`"
                    name="garage"
                    :value="garage.id"
                    v-model="form.garageId"
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                </div>
                <div class="ml-3 flex-1">
                  <label :for="`garage-${garage.id}`" class="text-lg font-medium text-gray-900 block">
                    {{ garage.name }}
                  </label>
                  <div class="mt-1 text-sm text-gray-500">
                    {{ garage.city }}, {{ garage.postal_code }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button
              type="button"
              @click="goToStep(0)"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Retour
            </button>
            <button
              type="button"
              @click="goToStep(2)"
              :disabled="!form.garageId"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
              <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

<!-- Étape 3 : Sélection des opérations -->
<div v-if="currentStep === 2" class="p-6">
  <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner les opérations</h2>

  <div class="mt-4 space-y-6">
    <div
      v-for="category in operationCategories"
      :key="category.id"
      class="border rounded-lg overflow-hidden"
    >
      <div class="bg-gray-50 px-4 py-3 border-b">
        <h3 class="text-base font-medium text-gray-900">{{ category.name }}</h3>
      </div>
      <div class="p-4 space-y-3">
        <div
          v-for="operation in getOperationsByCategory(category.id)"
          :key="operation.id"
          class="flex items-start space-x-3"
        >
          <div class="flex items-center h-5 mt-1">
            <input
              :id="`operation-${operation.id}`"
              name="operations"
              type="checkbox"
              :value="operation.id"
              v-model="form.operations"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div class="flex-1">
            <div class="flex justify-between">
              <label
                :for="`operation-${operation.id}`"
                class="text-sm font-medium text-gray-900"
              >
                {{ getOperationName(operation.id) }}
              </label>
              <span class="text-sm font-medium text-gray-900">
                {{ formatPrice(getOperationPrice(operation.id)) }}
              </span>
            </div>
            <p
              v-if="operation.additionalHelp"
              class="mt-1 text-sm text-gray-500"
            >
              {{ operation.additionalHelp }}
            </p>
            <p
              v-if="operation.additionalComment"
              class="mt-1 text-xs italic text-gray-500"
            >
              {{ operation.additionalComment }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="form.operations.length > 0" class="mt-6 bg-gray-50 p-4 rounded-md">
    <h4 class="text-sm font-medium text-gray-900">Opérations sélectionnées</h4>
    <div class="mt-2 space-y-2">
      <div
        v-for="operationId in form.operations"
        :key="operationId"
        class="flex justify-between text-sm"
      >
        <span>{{ getOperationName(operationId) }}</span>
        <span>{{ formatPrice(getOperationPrice(operationId)) }}</span>
      </div>
      <div class="pt-2 border-t border-gray-200 flex justify-between font-medium">
        <span>Total</span>
        <span>{{ formatPrice(calculateTotal()) }}</span>
      </div>
    </div>
  </div>

  <div class="mt-8 flex justify-between">
    <button
      type="button"
      @click="goToStep(1)"
      class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg
        class="mr-2 -ml-1 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
      Retour
    </button>
    <button
      type="button"
      @click="goToStep(3)"
      :disabled="form.operations.length === 0"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continuer
      <svg
        class="ml-2 -mr-1 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</div>

        <!-- Étape 4 : Sélection de la date et du créneau -->
        <div v-if="currentStep === 3" class="p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Sélectionner une date et un créneau</h2>

          <div class="mb-6">
            <label for="appointment-date" class="block text-sm font-medium text-gray-700 mb-2">Date souhaitée</label>
            <input
              type="date"
              id="appointment-date"
              v-model="form.date"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              :min="minDate"
            />
          </div>

          <div v-if="form.date && availableTimeSlots.length > 0" class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Créneaux disponibles</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div
                v-for="(slot, index) in availableTimeSlots"
                :key="index"
                @click="selectTimeSlot(slot)"
                class="py-2 px-3 border rounded-md text-center cursor-pointer transition-colors"
                :class="form.timeSlot === slot ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'border-gray-300 hover:bg-gray-50'"
              >
                {{ formatTimeSlot(slot.start) }}
              </div>
            </div>
          </div>

          <div v-else-if="form.date" class="mb-6 text-center py-4 bg-gray-50 rounded-md">
            <p class="text-gray-500">Aucun créneau disponible à cette date</p>
            <p class="text-sm text-gray-500 mt-1">Veuillez sélectionner une autre date</p>
          </div>

          <div v-if="form.timeSlot" class="mt-6 bg-gray-50 p-4 rounded-md">
            <h4 class="text-sm font-medium text-gray-900">Récapitulatif</h4>
            <dl class="mt-2 space-y-2">
              <div class="flex justify-between text-sm">
                <dt>Véhicule</dt>
                <dd>{{ getVehicleInfo(form.vehicleId) }}</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt>Garage</dt>
                <dd>{{ getGarageName(form.garageId) }}</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt>Date et heure</dt>
                <dd>{{ formatTimeSlot(form.timeSlot.start, true) }}</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt>Durée estimée</dt>
                <dd>{{ Math.round(form.timeSlot.duration / 60 * 10) / 10 }} heure(s)</dd>
              </div>
              <div class="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{{ formatPrice(calculateTotal()) }}</dd>
              </div>
            </dl>
          </div>

          <div class="mt-8 flex justify-between">
            <button
              type="button"
              @click="goToStep(2)"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Retour
            </button>
            <button
              type="button"
              @click="submitAppointment"
              :disabled="!isFormValid || isSubmitting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'
import client from '@/js/client'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const garageStore = useGarageStore()

const garages = ref([])
const operationCategories = ref([])
const operationCache = ref({}) // id -> opération

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
  const price = operationCache.value[operationId]?.price || 0
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
  const numericPrice = parseFloat(price)
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
