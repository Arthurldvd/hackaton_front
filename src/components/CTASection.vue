<template>
  <section class="py-16 md:py-24 bg-indigo-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">{{ title }}</h2>
      <p class="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
        {{ description }}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <slot></slot>
      </div>
    </div>
  </section>
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