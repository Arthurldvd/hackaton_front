<template>
  <PageLayout>
    <div class="max-w-4xl mx-auto">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 shadow-lg">
        <h1 class="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-4a1 1 0 00-1-1h-8a1 1 0 00-.8.4L8.4 8H5V5a1 1 0 00-1-1H3z" />
          </svg>
          Ajouter un véhicule
        </h1>
        <p class="text-blue-100 mt-2">Renseignez les informations de votre véhicule pour l'ajouter à votre garage</p>
      </div>
      
      <div class="bg-white rounded-b-xl shadow-lg p-6 mb-10">
        <FormError :message="formError" class="mb-6" />
        
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <FormSection title="Informations générales" icon="car">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                v-model="form.brand"
                label="Marque"
                name="brand"
                id="brand"
                required
                icon="brand"
                placeholder="Ex: Renault, Peugeot, BMW..."
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />

              <FormInput 
                v-model="form.model"
                label="Modèle"
                name="model"
                id="model"
                required
                icon="model"
                placeholder="Ex: Clio, 308, X5..."
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />
            </div>
          </FormSection>
          
          <FormSection title="Identité du véhicule" icon="identity">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                v-model="form.license_plate"
                label="Plaque d'immatriculation"
                name="license_plate"
                id="license_plate"
                required
                icon="license"
                placeholder="AB-123-CD"
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />

              <FormInput 
                v-model="form.vin"
                label="Numéro d'identification (VIN)"
                name="vin"
                id="vin"
                required
                icon="barcode"
                placeholder="ABCDEFGH123456789"
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />
            </div>
          </FormSection>
          
          <FormSection title="Informations techniques" icon="settings">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                v-model="form.registration_date"
                label="Date de première mise en circulation"
                name="registration_date"
                id="registration_date"
                type="date"
                required
                icon="calendar"
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />

              <FormInput 
                v-model="form.mileage"
                label="Kilométrage actuel"
                name="mileage"
                id="mileage"
                type="number"
                required
                min="0"
                suffix="km"
                icon="speedometer"
                class="transform transition-all duration-200 hover:scale-[1.01]"
              />
            </div>
          </FormSection>
          
          <div class="pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <router-link to="/vehicles">
              <ActionButton variant="secondary" class="px-5 py-2">
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  Annuler
                </span>
              </ActionButton>
            </router-link>
            
            <ActionButton 
              type="submit"
              :loading="isSubmitting"
              class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform transition-all duration-200 hover:scale-[1.02]"
            >
              <span v-if="!isSubmitting" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Enregistrer le véhicule
              </span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGarageStore } from '../stores/garage'

import PageLayout from '../components/PageLayout.vue'
import FormInput from '../components/FormInput.vue'
import FormError from '../components/FormError.vue'
import FormSection from '../components/FormSection.vue'
import ActionButton from '../components/ActionButton.vue'

const router = useRouter()
const garageStore = useGarageStore()

const form = ref({
  brand: '',
  model: '',
  license_plate: '',
  vin: '',
  registration_date: '',
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
  
  if (!form.value.license_plate || !form.value.license_plate.trim()) {
    formError.value = 'La plaque d\'immatriculation est requise'
    return false
  }
  
  if (!form.value.vin || !form.value.vin.trim()) {
    formError.value = 'Le numéro d\'identification (VIN) est requis'
    return false
  }
  
  if (!form.value.registration_date) {
    formError.value = 'La date de première mise en circulation est requise'
    return false
  }
  
  if (form.value.mileage < 0) {
    formError.value = 'Le kilométrage ne peut pas être négatif'
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
    
    const date = new Date(form.value.registration_date)
    const formattedDate = date.toISOString().split('T')[0]
    
    const vehicleData = {
      ...form.value,
      registration_date: formattedDate
    }
    
    await garageStore.addVehicle(vehicleData)
    
    router.push('/vehicles')
  } catch (error) {
    formError.value = error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement du véhicule'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

form {
  animation: fadeIn 0.5s ease-out;
}
</style> 