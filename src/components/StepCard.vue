<template>
  <div class="text-center">
    <div class="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6 text-white mx-auto">
      <span class="text-xl font-bold">{{ stepNumber }}</span>
    </div>
    <h3 class="font-bold text-xl text-gray-900 mb-3">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  stepNumber: {
    type: [Number, String],
    required: true
  },
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