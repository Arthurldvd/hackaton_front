<template>
  <PageLayout title="Ajouter un véhicule">
    <form @submit.prevent="handleSubmit" class="p-6">
      <FormError :message="formError" />
      
      <FormSection>
        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.brand"
            label="Marque"
            name="brand"
            id="brand"
            required
          />
        </div>

        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.model"
            label="Modèle"
            name="model"
            id="model"
            required
          />
        </div>

        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.licensePlate"
            label="Plaque d'immatriculation"
            name="licensePlate"
            id="licensePlate"
            required
            placeholder="AB-123-CD"
          />
        </div>

        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.vin"
            label="Numéro d'identification (VIN)"
            name="vin"
            id="vin"
            required
            placeholder="ABCDEFGH123456789"
          />
        </div>

        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.registrationDate"
            label="Date de première mise en circulation"
            name="registrationDate"
            id="registrationDate"
            type="date"
            required
          />
        </div>

        <div class="sm:col-span-3">
          <FormInput 
            v-model="form.mileage"
            label="Kilométrage actuel"
            name="mileage"
            id="mileage"
            type="number"
            required
            min="0"
            suffix="km"
          />
        </div>
      </FormSection>
      
      <div class="mt-8 flex justify-end space-x-3">
        <router-link to="/vehicles">
          <ActionButton variant="secondary">
            Annuler
          </ActionButton>
        </router-link>
        
        <ActionButton 
          type="submit"
          :loading="isSubmitting"
        >
          {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer le véhicule' }}
        </ActionButton>
      </div>
    </form>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGarageStore } from '../stores/garage'

// Composants
import PageLayout from '../components/PageLayout.vue'
import FormInput from '../components/FormInput.vue'
import FormError from '../components/FormError.vue'
import FormSection from '../components/FormSection.vue'
import ActionButton from '../components/ActionButton.vue'

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