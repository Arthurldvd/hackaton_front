<template>
  <AuthLayout title="Connexion" :subtitle="true">
    <template #back-button>
      <BackButton to="/" text="Retour à l'accueil" />
    </template>
    
    <template #subtitle>
      Ou
      <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
        créez un compte
      </router-link>
    </template>
    
    <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
      <FormError :message="errorMessage" />
      
      <div class="rounded-md -space-y-px">
        <div class="mb-6">
          <FormInput
            id="email-address"
            name="email"
            type="email"
            label="Adresse e-mail"
            placeholder="exemple@email.com"
            v-model="email"
            required
          />
        </div>
        
        <div>
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Mot de passe"
            placeholder="Votre mot de passe"
            v-model="password"
            required
          />
        </div>
      </div>

      <div class="flex items-center justify-between">
        <FormCheckbox
          id="remember-me"
          name="remember-me"
          label="Se souvenir de moi"
          v-model="rememberMe"
        />
      </div>

      <div>
        <ActionButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          class="w-full"
        >
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </ActionButton>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthLayout from '../components/AuthLayout.vue'
import BackButton from '../components/BackButton.vue'
import FormInput from '../components/FormInput.vue'
import FormError from '../components/FormError.vue'
import FormCheckbox from '../components/FormCheckbox.vue'
import ActionButton from '../components/ActionButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.login(email.value, password.value, rememberMe.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error?.message || "Une erreur est survenue lors de la connexion"
  } finally {
    isLoading.value = false
  }
}
</script> 