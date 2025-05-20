<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Ajouter un véhicule</h1>
      </div>
      
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <form @submit.prevent="handleSubmit" class="p-6">
          <div v-if="formError" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ formError }}</p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="brand" class="block text-sm font-medium text-gray-700">Marque</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  name="brand" 
                  id="brand" 
                  v-model="form.brand"
                  required
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="model" class="block text-sm font-medium text-gray-700">Modèle</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  name="model" 
                  id="model" 
                  v-model="form.model"
                  required
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="licensePlate" class="block text-sm font-medium text-gray-700">Plaque d'immatriculation</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  name="licensePlate" 
                  id="licensePlate" 
                  v-model="form.licensePlate"
                  required
                  placeholder="AB-123-CD"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="vin" class="block text-sm font-medium text-gray-700">Numéro d'identification (VIN)</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  name="vin" 
                  id="vin" 
                  v-model="form.vin"
                  required
                  placeholder="ABCDEFGH123456789"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="registrationDate" class="block text-sm font-medium text-gray-700">Date de première mise en circulation</label>
              <div class="mt-1">
                <input 
                  type="date" 
                  name="registrationDate" 
                  id="registrationDate" 
                  v-model="form.registrationDate"
                  required
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="mileage" class="block text-sm font-medium text-gray-700">Kilométrage actuel</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input 
                  type="number" 
                  name="mileage" 
                  id="mileage" 
                  v-model.number="form.mileage"
                  required
                  min="0"
                  class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-16 sm:text-sm border-gray-300 rounded-md"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">km</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end space-x-3">
            <router-link
              to="/vehicles"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'
import AppHeader from '../components/AppHeader.vue'

const router = useRouter()
const authStore = useAuthStore()
const garageStore = useGarageStore()

const form = ref({
  brand: '',
  model: '',
  licensePlate: '',
  vin: '',
  registrationDate: '',
  mileage: 0
})

const isSubmitting = ref(false)
const formError = ref('')

const validateForm = () => {
  if (!form.value.brand || !form.value.brand.trim()) {
    formError.value = 'La marque est requise'
    return false
  }
  
  if (!form.value.model || !form.value.model.trim()) {
    formError.value = 'Le modèle est requis'
    return false
  }
  
  if (!form.value.licensePlate || !form.value.licensePlate.trim()) {
    formError.value = 'La plaque d\'immatriculation est requise'
    return false
  }
  
  if (!form.value.vin || !form.value.vin.trim()) {
    formError.value = 'Le numéro d\'identification (VIN) est requis'
    return false
  }
  
  if (!form.value.registrationDate) {
    formError.value = 'La date de première mise en circulation est requise'
    return false
  }
  
  if (form.value.mileage < 0) {
    formError.value = 'Le kilométrage ne peut pas être négatif'
    return false
  }
  
  // Vérifier si la plaque d'immatriculation existe déjà
  const existingVehicle = garageStore.vehicles.find(
    v => v.licensePlate.toLowerCase() === form.value.licensePlate.toLowerCase()
  )
  
  if (existingVehicle) {
    formError.value = 'Un véhicule avec cette plaque d\'immatriculation existe déjà'
    return false
  }
  
  // Vérifier si le VIN existe déjà
  const existingVin = garageStore.vehicles.find(
    v => v.vin.toLowerCase() === form.value.vin.toLowerCase()
  )
  
  if (existingVin) {
    formError.value = 'Un véhicule avec ce numéro d\'identification (VIN) existe déjà'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  formError.value = ''
  
  if (!validateForm()) {
    return
  }
  
  try {
    isSubmitting.value = true
    
    // Simuler un délai de réseau
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Ajouter le véhicule
    const newVehicle = garageStore.addVehicle({
      ...form.value,
      clientId: authStore.user.id
    })
    
    // Rediriger vers la liste des véhicules
    router.push('/vehicles')
  } catch (error) {
    formError.value = error.message || 'Une erreur est survenue lors de l\'enregistrement du véhicule'
  } finally {
    isSubmitting.value = false
  }
}
</script> 