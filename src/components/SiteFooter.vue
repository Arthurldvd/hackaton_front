<template>
  <footer class="bg-gray-900 text-gray-400 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white mb-4">{{ title }}</h2>
        <p class="mb-6">{{ tagline }}</p>
        <p class="text-sm">© {{ currentYear }} {{ copyright }}. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  copyright: {
    type: String,
    required: true
  }
});

const currentYear = computed(() => new Date().getFullYear());
</script> 