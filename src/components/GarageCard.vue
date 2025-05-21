<template>
  <div class="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
    <h3 class="font-medium text-gray-900">{{ name }}</h3>
    <p class="text-sm text-gray-500 mt-1">{{ address || 'Adresse inconnue' }}</p>
    <p class="text-sm text-gray-500">{{ postalCode }} {{ city }}</p>
    <div class="mt-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    default: ''
  }
});
</script> 