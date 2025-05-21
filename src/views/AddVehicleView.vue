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
            v-model="form.license_plate"
            label="Plaque d'immatriculation"
            name="license_plate"
            id="license_plate"
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
            v-model="form.registration_date"
            label="Date de première mise en circulation"
            name="registration_date"
            id="registration_date"
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
    
    // Formater la date pour correspondre au format attendu par l'API
    const vehicleData = {
      ...form.value,
      registration_date: new Date(form.value.registration_date).toISOString()
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