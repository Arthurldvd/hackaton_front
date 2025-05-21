<template>
  <div class="bg-indigo-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
      <slot name="icon"></slot>
    </div>
    <h3 class="font-bold text-xl text-gray-900 mb-3">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
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
    required: true
  }
});
</script> 