<script setup>
import HeroSection from '../components/HeroSection.vue';
import FeatureCard from '../components/FeatureCard.vue';
import StepCard from '../components/StepCard.vue';
import CTASection from '../components/CTASection.vue';
import SiteFooter from '../components/SiteFooter.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ActionButton from '../components/ActionButton.vue';
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <HeroSection
      title="Entretenez votre véhicule simplement"
      description="Prenez rendez-vous avec un garage en quelques clics et suivez l'entretien de vos véhicules facilement."
      imageSrc="/car-service.svg"
      imageAlt="Entretien automobile"
    >
      <template #actions>
        <router-link to="/register" class="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors font-medium text-center">
          Créer un compte
        </router-link>
        <router-link to="/login" class="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium text-center">
          Se connecter
        </router-link>
      </template>
    </HeroSection>

    <!-- Features Section -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Pourquoi choisir Car Appointment"
          subtitle="Une solution complète pour la gestion et l'entretien de vos véhicules"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Rapide et facile"
            description="Prenez rendez-vous à tout moment, sans attente téléphonique. Interface simple et intuitive."
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard
            title="Personnalisé pour vous"
            description="Choisissez précisément les opérations dont vous avez besoin selon votre véhicule et vos besoins."
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard
            title="Suivi complet"
            description="Gardez un historique de tous vos rendez-vous et l'entretien de vos véhicules en un seul endroit."
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Comment ça marche"
          subtitle="En quelques étapes simples, prenez rendez-vous pour l'entretien de votre véhicule"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard
            stepNumber="1"
            title="Créez un compte"
            description="Inscrivez-vous en quelques secondes pour accéder à la plateforme."
          />
          
          <StepCard
            stepNumber="2"
            title="Ajoutez vos véhicules"
            description="Enregistrez les informations de vos véhicules dans votre espace personnel."
          />
          
          <StepCard
            stepNumber="3"
            title="Choisissez un garage"
            description="Sélectionnez le garage le plus proche ou celui qui vous convient le mieux."
          />
          
          <StepCard
            stepNumber="4"
            title="Prenez rendez-vous"
            description="Sélectionnez les opérations souhaitées et choisissez la date qui vous convient."
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <CTASection
      title="Prêt à simplifier l'entretien de votre véhicule ?"
      description="Rejoignez des milliers d'utilisateurs qui font confiance à Car Appointment pour la gestion de leurs véhicules."
    >
      <router-link to="/register" class="px-8 py-4 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition-colors font-medium text-center">
        Commencer maintenant
      </router-link>
    </CTASection>

    <!-- Footer -->
    <SiteFooter
      title="Car Appointment"
      tagline="La plateforme simple pour l'entretien de vos véhicules"
      copyright="Car Appointment"
    />
  </main>
</template>
