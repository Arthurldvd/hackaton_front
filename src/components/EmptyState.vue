<template>
  <div v-if="simple" class="text-center py-4">
    <p class="text-gray-500">{{ description }}</p>
  </div>
  <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
    <slot name="icon">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </slot>
    
    <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ description }}
    </p>
    
    <div class="mt-6">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  simple: {
    type: Boolean,
    default: false
  }
});
</script> 