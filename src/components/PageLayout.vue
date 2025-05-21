<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
        <slot name="header-actions"></slot>
      </div>
      
      <div class="overflow-hidden sm:rounded-lg">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue';

defineProps({
  title: {
    type: String,
    required: true
  }
});
</script> 