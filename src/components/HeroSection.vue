<template>
  <section class="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div class="flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-12 md:mb-0">
          <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            {{ title }}
          </h1>
          <p class="text-xl text-indigo-100 mb-8 max-w-xl">
            {{ description }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="md:w-1/2 flex justify-center">
          <img :src="imageSrc" :alt="imageAlt" class="w-full max-w-md" />
        </div>
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
  },
  imageSrc: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: 'Image descriptive'
  }
});
</script> 