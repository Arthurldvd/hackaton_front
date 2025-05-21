<template>
  <AuthLayout title="Création de compte" :subtitle="true">
    <template #back-button>
      <BackButton to="/" text="Retour à l'accueil" />
    </template>
    
    <template #subtitle>
      Ou
      <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
        connectez-vous à votre compte
      </router-link>
    </template>
    
    <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
      <FormError :message="errorMessage" />
      
      <div class="rounded-md space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <FormInput
            id="last-name"
            name="last-name"
            type="text"
            label="Nom"
            placeholder="Dupont"
            v-model="lastName"
            required
          />
          
          <FormInput
            id="first-name"
            name="first-name"
            type="text"
            label="Prénom"
            placeholder="Jean"
            v-model="firstName"
            required
          />
        </div>
        
        <FormInput
          id="phone"
          name="phone"
          type="tel"
          label="Téléphone"
          placeholder="0612345678"
          v-model="phone"
        />
        
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Adresse</label>
          <div class="mt-1">
            <textarea
              id="address"
              name="address"
              rows="2"
              v-model="address"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="123 rue de Paris, 75001 Paris"
            ></textarea>
          </div>
        </div>
        
        <FormInput
          id="email-address"
          name="email"
          type="email"
          label="Adresse e-mail"
          placeholder="exemple@email.com"
          v-model="email"
          required
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Mot de passe"
          placeholder="Choisissez un mot de passe sécurisé"
          v-model="password"
          required
        />
        
        <FormInput
          id="password-confirm"
          name="password-confirm"
          type="password"
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          v-model="passwordConfirm"
          required
        />
        
        <FormCheckbox
          id="is-driver"
          name="is-driver"
          label="Je suis le conducteur du véhicule"
          v-model="isDriver"
        />
        
        <ConditionalSection
          v-if="!isDriver"
          title="Informations du conducteur"
        >
          <div class="grid grid-cols-2 gap-4">
            <FormInput
              id="driver-last-name"
              name="driver-last-name"
              type="text"
              label="Nom du conducteur"
              placeholder="Dupont"
              v-model="driverLastName"
            />
            
            <FormInput
              id="driver-first-name"
              name="driver-first-name"
              type="text"
              label="Prénom du conducteur"
              placeholder="Jean"
              v-model="driverFirstName"
            />
          </div>
          
          <FormInput
            id="driver-phone"
            name="driver-phone"
            type="tel"
            label="Téléphone du conducteur"
            placeholder="0612345678"
            v-model="driverPhone"
          />
        </ConditionalSection>
      </div>

      <div>
        <ActionButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="w-full"
        >
          {{ isLoading ? 'Création en cours...' : 'Créer un compte' }}
        </ActionButton>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthLayout from '../components/AuthLayout.vue'
import BackButton from '../components/BackButton.vue'
import FormInput from '../components/FormInput.vue'
import FormError from '../components/FormError.vue'
import FormCheckbox from '../components/FormCheckbox.vue'
import ActionButton from '../components/ActionButton.vue'
import ConditionalSection from '../components/ConditionalSection.vue'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const phone = ref('')
const address = ref('')
const isDriver = ref(true)
const driverFirstName = ref('')
const driverLastName = ref('')
const driverPhone = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

watch(isDriver, (newVal) => {
  if (newVal) {
    driverFirstName.value = ''
    driverLastName.value = ''
    driverPhone.value = ''
  }
})

const validateForm = () => {
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = "Les mots de passe ne correspondent pas"
    return false
  }
  
  if (!isDriver.value && (!driverFirstName.value || !driverLastName.value)) {
    errorMessage.value = "Veuillez renseigner les informations du conducteur"
    return false
  }
  
  return true
}

const handleRegister = async () => {
  try {
    if (!validateForm()) return
    
    isLoading.value = true
    errorMessage.value = ''
    
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      isDriver: isDriver.value,
      driverFirstName: driverFirstName.value,
      driverLastName: driverLastName.value,
      driverPhone: driverPhone.value
    }
    
    await authStore.register(userData, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error?.message || "Une erreur est survenue lors de l'inscription"
  } finally {
    isLoading.value = false
  }
}
</script> 