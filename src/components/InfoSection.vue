<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
    <div class="px-4 py-5 sm:px-6 bg-gray-50">
      <h3 class="text-lg leading-6 font-medium text-gray-900">{{ title }}</h3>
      <p v-if="description" class="mt-1 max-w-2xl text-sm text-gray-500">{{ description }}</p>
    </div>
    <div class="border-t border-gray-200">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
});
</script> 