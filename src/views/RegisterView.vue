<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <div class="flex justify-start mb-4">
          <router-link to="/" class="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Retour à l'accueil
          </router-link>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Création de compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ou
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            connectez-vous à votre compte
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
        
        <div class="rounded-md space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input id="last-name" name="last-name" type="text" required
                v-model="lastName"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Dupont" />
            </div>
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input id="first-name" name="first-name" type="text" required
                v-model="firstName"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Jean" />
            </div>
          </div>
          
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input id="phone" name="phone" type="tel"
              v-model="phone"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0612345678" />
          </div>
          
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea id="address" name="address" rows="2"
              v-model="address"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="123 rue de Paris, 75001 Paris"></textarea>
          </div>
          
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
              v-model="email"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="exemple@email.com" />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required
              v-model="password"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Choisissez un mot de passe sécurisé" />
          </div>
          
          <div>
            <label for="password-confirm" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" required
              v-model="passwordConfirm"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirmez votre mot de passe" />
          </div>
          
          <div class="flex items-center">
            <input id="is-driver" name="is-driver" type="checkbox" 
              v-model="isDriver"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <label for="is-driver" class="ml-2 block text-sm text-gray-900">
              Je suis le conducteur du véhicule
            </label>
          </div>
          
          <div v-if="!isDriver" class="space-y-4 pt-2 border-t border-gray-200 mt-4">
            <h3 class="text-lg font-medium text-gray-900">Informations du conducteur</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="driver-last-name" class="block text-sm font-medium text-gray-700 mb-1">Nom du conducteur</label>
                <input id="driver-last-name" name="driver-last-name" type="text"
                  v-model="driverLastName"
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Dupont" />
              </div>
              <div>
                <label for="driver-first-name" class="block text-sm font-medium text-gray-700 mb-1">Prénom du conducteur</label>
                <input id="driver-first-name" name="driver-first-name" type="text"
                  v-model="driverFirstName"
                  class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Jean" />
              </div>
            </div>
            <div>
              <label for="driver-phone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone du conducteur</label>
              <input id="driver-phone" name="driver-phone" type="tel"
                v-model="driverPhone"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="0612345678" />
            </div>
          </div>
        </div>

        <div>
          <button type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Création en cours...' : 'Créer un compte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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