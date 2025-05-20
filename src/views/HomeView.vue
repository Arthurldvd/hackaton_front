<script setup>
// Pas besoin d'importer TheWelcome car il n'est plus utilisé
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-12 md:mb-0">
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Entretenez votre véhicule simplement
            </h1>
            <p class="text-xl text-indigo-100 mb-8 max-w-xl">
              Prenez rendez-vous avec un garage en quelques clics et suivez l'entretien de vos véhicules facilement.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link 
                to="/register" 
                class="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors font-medium text-center"
              >
                Créer un compte
              </router-link>
              <router-link 
                to="/login" 
                class="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium text-center"
              >
                Se connecter
              </router-link>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-center">
            <img src="/car-service.svg" alt="Entretien automobile" class="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir Car Appointment</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Une solution complète pour la gestion et l'entretien de vos véhicules
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-indigo-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Rapide et facile</h3>
            <p class="text-gray-600">Prenez rendez-vous à tout moment, sans attente téléphonique. Interface simple et intuitive.</p>
          </div>
          
          <div class="bg-indigo-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Personnalisé pour vous</h3>
            <p class="text-gray-600">Choisissez précisément les opérations dont vous avez besoin selon votre véhicule et vos besoins.</p>
          </div>
          
          <div class="bg-indigo-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Suivi complet</h3>
            <p class="text-gray-600">Gardez un historique de tous vos rendez-vous et l'entretien de vos véhicules en un seul endroit.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            En quelques étapes simples, prenez rendez-vous pour l'entretien de votre véhicule
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
              <span class="text-xl font-bold">1</span>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Créez un compte</h3>
            <p class="text-gray-600">Inscrivez-vous en quelques secondes pour accéder à la plateforme.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
              <span class="text-xl font-bold">2</span>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Ajoutez vos véhicules</h3>
            <p class="text-gray-600">Enregistrez les informations de vos véhicules dans votre espace personnel.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
              <span class="text-xl font-bold">3</span>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Choisissez un garage</h3>
            <p class="text-gray-600">Sélectionnez le garage le plus proche ou celui qui vous convient le mieux.</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
              <span class="text-xl font-bold">4</span>
            </div>
            <h3 class="font-bold text-xl text-gray-900 mb-3">Prenez rendez-vous</h3>
            <p class="text-gray-600">Sélectionnez les opérations souhaitées et choisissez la date qui vous convient.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-indigo-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier l'entretien de votre véhicule ?</h2>
        <p class="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui font confiance à Car Appointment pour la gestion de leurs véhicules.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/register" 
            class="px-8 py-4 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors font-medium text-center"
          >
            Commencer maintenant
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Car Appointment</h2>
          <p class="mb-6">La plateforme simple pour l'entretien de vos véhicules</p>
          <p class="text-sm">© {{ new Date().getFullYear() }} Car Appointment. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </main>
</template>
